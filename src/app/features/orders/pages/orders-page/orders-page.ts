import { Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import {
  Order,
  OrderMatchedUser,
  OrderResponseItem,
  OrderStatsCard,
  OrderStatus,
  PaymentStatus,
} from '../../models/orders.model';
import { DataTableColumn } from '../../../../shared/components/models/data-table.model';
import { OrdersService } from '../../../../core/services/orders.service';
import { AuthService } from '../../../../core/services/auth.service';

type OrderSortField = 'total' | 'date' | 'orderId' | 'customerName';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-orders-page',
  standalone: false,
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.css',
})
export class OrdersPage implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly authService = inject(AuthService);

  columns: DataTableColumn[] = [
    { field: 'orderId', header: 'ORDER ID', width: '14%' },
    { field: 'customer', header: 'CUSTOMER', width: '32%' },
    { field: 'total', header: 'TOTAL PRICE', width: '14%' },
    { field: 'paymentStatus', header: 'PAYMENT STATUS', width: '14%' },
    { field: 'orderStatus', header: 'SHIPPING STATUS', width: '14%' },
    { field: 'date', header: 'DATE OF ORDER', width: '12%' },
  ];

  readonly pageSize = 4;
  readonly orderStatusOptions: Array<'ALL' | OrderStatus> = [
    'ALL',
    'Delivered',
    'Confirmed',
    'Pending',
    'Shipped',
    'Cancelled',
  ];
  readonly paymentStatusOptions: Array<'ALL' | PaymentStatus> = ['ALL', 'Paid', 'Unpaid'];
  readonly sortFields: ReadonlyArray<{ label: string; value: OrderSortField }> = [
    { label: 'Date', value: 'date' },
    { label: 'Total', value: 'total' },
    { label: 'Order ID', value: 'orderId' },
    { label: 'Customer Name', value: 'customerName' },
  ];

  searchTerm = '';
  selectedOrderStatus: 'ALL' | OrderStatus = 'ALL';
  selectedPaymentStatus: 'ALL' | PaymentStatus = 'ALL';
  selectedSortField: OrderSortField = 'date';
  selectedSortDirection: SortDirection = 'desc';
  currentPage = 1;
  isLoading = true;
  errorMessage = '';

  allOrders: Order[] = [];

  ngOnInit(): void {
    this.loadOrders();
  }

  get statsCards(): OrderStatsCard[] {
    const pendingOrders = this.allOrders.filter((order) => order.orderStatus === 'Pending').length;
    const completedOrders = this.allOrders.filter(
      (order) => order.orderStatus === 'Delivered',
    ).length;
    const totalRevenue = this.allOrders.reduce((sum, order) => sum + order.total, 0);

    return [
      {
        iconClass: 'pi pi-shopping-cart text-[#2f6bff]',
        iconWrapperClass: 'bg-[#edf4ff]',
        title: 'TOTAL ORDERS',
        value: this.allOrders.length.toString(),
      },
      {
        iconClass: 'pi pi-clock text-[#e7a11b]',
        iconWrapperClass: 'bg-[#fff7e8]',
        title: 'PENDING ORDERS',
        value: pendingOrders.toString(),
      },
      {
        iconClass: 'pi pi-check-circle text-[#17b26a]',
        iconWrapperClass: 'bg-[#ebfbf3]',
        title: 'COMPLETED ORDERS',
        value: completedOrders.toString(),
      },
      {
        iconClass: 'pi pi-wallet text-[#9a4dff]',
        iconWrapperClass: 'bg-[#f7f0ff]',
        title: 'TOTAL REVENUE',
        value: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'EGP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(totalRevenue),
      },
    ];
  }

  get filteredAndSortedOrders(): Order[] {
    const normalizedSearch = this.searchTerm.trim().toLowerCase();

    const filteredOrders = this.allOrders.filter((order) => {
      const matchesSearch =
        !normalizedSearch ||
        order.orderId.toLowerCase().includes(normalizedSearch) ||
        order.customerName.toLowerCase().includes(normalizedSearch) ||
        order.customerEmail.toLowerCase().includes(normalizedSearch);
      const matchesOrderStatus =
        this.selectedOrderStatus === 'ALL' || order.orderStatus === this.selectedOrderStatus;
      const matchesPaymentStatus =
        this.selectedPaymentStatus === 'ALL' || order.paymentStatus === this.selectedPaymentStatus;

      return matchesSearch && matchesOrderStatus && matchesPaymentStatus;
    });

    return [...filteredOrders].sort((first, second) => {
      let comparison = 0;

      switch (this.selectedSortField) {
        case 'total':
          comparison = first.total - second.total;
          break;
        case 'orderId':
          comparison = first.orderId.localeCompare(second.orderId);
          break;
        case 'customerName':
          comparison = first.customerName.localeCompare(second.customerName);
          break;
        case 'date':
        default:
          comparison = new Date(first.date).getTime() - new Date(second.date).getTime();
          break;
      }

      return this.selectedSortDirection === 'asc' ? comparison : comparison * -1;
    });
  }

  get paginatedOrders(): Order[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredAndSortedOrders.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredAndSortedOrders.length / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get showingFrom(): number {
    if (!this.filteredAndSortedOrders.length) {
      return 0;
    }

    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredAndSortedOrders.length);
  }

  updateSearchTerm(value: string): void {
    this.searchTerm = value;
    this.resetPagination();
  }

  updateSelectedOrderStatus(value: 'ALL' | OrderStatus): void {
    this.selectedOrderStatus = value;
    this.resetPagination();
  }

  updateSelectedPaymentStatus(value: 'ALL' | PaymentStatus): void {
    this.selectedPaymentStatus = value;
    this.resetPagination();
  }

  updateSelectedSortField(value: OrderSortField): void {
    this.selectedSortField = value;
    this.resetPagination();
  }

  updateSelectedSortDirection(value: SortDirection): void {
    this.selectedSortDirection = value;
    this.resetPagination();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
  }

  goToPreviousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  private resetPagination(): void {
    this.currentPage = 1;
  }

  private loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      ordersResponse: this.ordersService.getAllOrders(),
      usersResponse: this.authService.getAllUsers(),
    }).subscribe({
      next: ({ ordersResponse, usersResponse }) => {
        const usersById = usersResponse.data.reduce<Record<string, OrderMatchedUser>>(
          (accumulator, user) => {
            accumulator[user._id] = {
              _id: user._id,
              fullName: user.fullName,
              email: user.email,
            };
            return accumulator;
          },
          {},
        );

        this.allOrders = ordersResponse.data.map((order) => this.mapOrder(order, usersById));
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load orders right now. Please try again.';
        this.isLoading = false;
      },
    });
  }

  private mapOrder(
    order: OrderResponseItem,
    usersById: Record<string, OrderMatchedUser>,
  ): Order {
    const userId = typeof order.user === 'string' ? order.user : order.user._id;
    const matchedUser = usersById[userId];
    const fallbackName = typeof order.user === 'string' ? 'Unknown User' : order.user.name;
    const fallbackEmail = typeof order.user === 'string' ? 'No email available' : order.user.email;

    return {
      id: order._id,
      orderId: order._id.slice(0, 5),
      fullOrderId: order._id,
      customerId: userId,
      customerName: matchedUser?.fullName ?? fallbackName,
      customerEmail: matchedUser?.email ?? fallbackEmail,
      total: order.totalPrice,
      orderStatus: this.mapOrderStatus(order.status),
      paymentStatus: this.mapPaymentStatus(order.paymentStatus),
      date: order.createdAt,
    };
  }

  private mapOrderStatus(status: string): OrderStatus {
    switch (status.trim().toLowerCase()) {
      case 'delivered':
        return 'Delivered';
      case 'confirmed':
        return 'Confirmed';
      case 'shipped':
        return 'Shipped';
      case 'cancelled':
        return 'Cancelled';
      case 'pending':
      default:
        return 'Pending';
    }
  }

  private mapPaymentStatus(status: string): PaymentStatus {
    return status.trim().toLowerCase() === 'paid' ? 'Paid' : 'Unpaid';
  }
}
