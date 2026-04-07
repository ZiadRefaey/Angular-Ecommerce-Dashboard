import { Component } from '@angular/core';
import { Order, OrderStatsCard, OrderStatus, PaymentStatus } from '../../models/orders.model';
import { DataTableColumn } from '../../../../shared/components/models/data-table.model';

type OrderSortField = 'total' | 'date' | 'orderId' | 'customerName';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-orders-page',
  standalone: false,
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.css',
})
export class OrdersPage {
  columns: DataTableColumn[] = [
    { field: 'orderId', header: 'ORDER ID', width: '14%' },
    { field: 'customer', header: 'CUSTOMER', width: '28%' },
    { field: 'total', header: 'TOTAL', width: '12%' },
    { field: 'orderStatus', header: 'ORDER STATUS', width: '16%' },
    { field: 'paymentStatus', header: 'PAYMENT STATUS', width: '16%' },
    { field: 'date', header: 'DATE', width: '10%' },
    {
      field: 'actions',
      header: 'ACTIONS',
      width: '8%',
      headerAlign: 'right',
      bodyAlign: 'right',
    },
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

  allOrders: Order[] = [
    {
      id: 1,
      orderId: '#ORD-001',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.johnson@example.com',
      total: 249.99,
      orderStatus: 'Delivered',
      paymentStatus: 'Paid',
      date: '2026-03-24',
    },
    {
      id: 2,
      orderId: '#ORD-002',
      customerName: 'Michael Chen',
      customerEmail: 'michael.chen@example.com',
      total: 129.5,
      orderStatus: 'Confirmed',
      paymentStatus: 'Paid',
      date: '2026-03-24',
    },
    {
      id: 3,
      orderId: '#ORD-003',
      customerName: 'Emily Davis',
      customerEmail: 'emily.davis@example.com',
      total: 89.0,
      orderStatus: 'Pending',
      paymentStatus: 'Unpaid',
      date: '2026-03-23',
    },
    {
      id: 4,
      orderId: '#ORD-004',
      customerName: 'James Wilson',
      customerEmail: 'james.wilson@example.com',
      total: 459.0,
      orderStatus: 'Shipped',
      paymentStatus: 'Paid',
      date: '2026-03-23',
    },
    {
      id: 5,
      orderId: '#ORD-005',
      customerName: 'Olivia Martinez',
      customerEmail: 'olivia.martinez@example.com',
      total: 199.99,
      orderStatus: 'Cancelled',
      paymentStatus: 'Unpaid',
      date: '2026-03-22',
    },
    {
      id: 6,
      orderId: '#ORD-006',
      customerName: 'Daniel Brown',
      customerEmail: 'daniel.brown@example.com',
      total: 320.0,
      orderStatus: 'Delivered',
      paymentStatus: 'Paid',
      date: '2026-03-22',
    },
    {
      id: 7,
      orderId: '#ORD-007',
      customerName: 'Ava Thompson',
      customerEmail: 'ava.thompson@example.com',
      total: 78.4,
      orderStatus: 'Pending',
      paymentStatus: 'Unpaid',
      date: '2026-03-21',
    },
    {
      id: 8,
      orderId: '#ORD-008',
      customerName: 'Noah Garcia',
      customerEmail: 'noah.garcia@example.com',
      total: 615.2,
      orderStatus: 'Delivered',
      paymentStatus: 'Paid',
      date: '2026-03-21',
    },
    {
      id: 9,
      orderId: '#ORD-009',
      customerName: 'Sophia Lee',
      customerEmail: 'sophia.lee@example.com',
      total: 142.75,
      orderStatus: 'Confirmed',
      paymentStatus: 'Paid',
      date: '2026-03-20',
    },
    {
      id: 10,
      orderId: '#ORD-010',
      customerName: 'William Anderson',
      customerEmail: 'william.anderson@example.com',
      total: 980.0,
      orderStatus: 'Shipped',
      paymentStatus: 'Paid',
      date: '2026-03-19',
    },
  ];

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
          currency: 'USD',
          minimumFractionDigits: 2,
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
}
