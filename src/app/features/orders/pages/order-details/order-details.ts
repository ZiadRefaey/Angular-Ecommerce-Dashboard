import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { OrdersService } from '../../../../core/services/orders.service';
import { ProductsService } from '../../../../core/services/products.service';
import { IOrderDetails, IOrderItem, UpdateOrderStatus } from '../../models/orders.model';
import { StatusBadgeVariant } from '../../../../shared/components/status-badge/status-badge';
import { Product } from '../../../products/models/products.model';

@Component({
  selector: 'app-order-details',
  standalone: false,
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
})
export class OrderDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ordersService = inject(OrdersService);
  private readonly authService = inject(AuthService);
  private readonly productsService = inject(ProductsService);

  order: IOrderDetails = {
    id: '',
    status: 'pending',
    rawStatus: 'pending',
    shippingStatus: '',
    date: '',
    paymentStatus: '',
    paymentMethod: '-',
  };

  customer = {
    name: '',
    email: '',
    phone: '-',
  };

  address = {
    street: '-',
    city: '-',
    state: '-',
    postalCode: '-',
    country: '-',
  };

  summary = {
    subtotal: 'EGP 0',
    discount: '-',
    shippingFee: '-',
    paymentMethod: '-',
    paymentStatus: '-',
    coupon: '-',
    total: 'EGP 0',
  };
  orderItems: IOrderItem[] = [];
  isLoading = true;
  errorMessage = '';
  saveErrorMessage = '';
  isSaving = false;
  isCancelConfirmOpen = false;
  selectedStatus: UpdateOrderStatus = 'pending';

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');

    if (!orderId) {
      this.errorMessage = 'Unable to find this order.';
      this.isLoading = false;
      return;
    }

    this.ordersService
      .getOrderById(orderId)
      .pipe(
        switchMap((response) => {
          const userId =
            typeof response.data.user === 'string' ? response.data.user : response.data.user._id;
          const uniqueProductIds = [...new Set(response.data.items.map((item) => item.product._id))];
          const productsRequest = uniqueProductIds.length
            ? forkJoin(
                uniqueProductIds.map((productId) =>
                  this.productsService.getProductById(productId).pipe(map((productResponse) => productResponse.data[0])),
                ),
              )
            : of([] as Product[]);

          return forkJoin({
            userResponse: this.authService.getUserById(userId),
            products: productsRequest,
          }).pipe(
            map(({ userResponse, products }) => ({
              order: response.data,
              user: userResponse.data,
              products,
            })),
          );
        }),
      )
      .subscribe({
        next: ({ order, user, products }) => {
          const productsById = products.reduce<Record<string, Product>>((accumulator, product) => {
            if (product?._id) {
              accumulator[product._id] = product;
            }

            return accumulator;
          }, {});

          this.order = {
            id: order._id.slice(0, 5),
            status: this.mapOrderStatusToBadge(order.status),
            rawStatus: this.normalizeOrderStatus(order.status),
            shippingStatus: this.toTitleCase(order.status),
            date: new Intl.DateTimeFormat('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }).format(new Date(order.createdAt)),
            paymentStatus: this.toTitleCase(order.paymentStatus),
            paymentMethod: '-',
          };
          this.selectedStatus = this.normalizeOrderStatus(order.status);

          this.customer = {
            name: user.fullName,
            email: user.email,
            phone: user.phone || '-',
          };

          this.summary = {
            subtotal: this.formatCurrency(order.totalPrice),
            discount: '-',
            shippingFee: '-',
            paymentMethod: '-',
            paymentStatus: this.toTitleCase(order.paymentStatus),
            coupon: '-',
            total: this.formatCurrency(order.totalPrice),
          };

          this.orderItems = order.items.map((item, index) => ({
            id: index + 1,
            name: item.product.name,
            image: this.getProductImage(productsById[item.product._id]),
            variant: item.variationId || '-',
            quantity: item.quantity,
            unitPrice: item.product.price,
            total: item.product.price * item.quantity,
          }));

          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Unable to load this order right now.';
          this.isLoading = false;
        },
      });
  }

  saveOrder(): void {
    if (this.isSaving) {
      return;
    }

    this.saveErrorMessage = '';

    if (this.selectedStatus === 'cancelled') {
      this.isCancelConfirmOpen = true;
      return;
    }

    this.submitOrderStatusUpdate();
  }

  onStatusChange(status: UpdateOrderStatus): void {
    this.selectedStatus = status;
  }

  closeCancelConfirm(): void {
    this.isCancelConfirmOpen = false;
  }

  confirmCancelOrder(): void {
    if (this.isSaving) {
      return;
    }

    this.isCancelConfirmOpen = false;
    this.submitOrderStatusUpdate();
  }

  private submitOrderStatusUpdate(): void {
    this.isSaving = true;
    this.ordersService
      .updateOrderStatus(this.route.snapshot.paramMap.get('id') ?? '', { status: this.selectedStatus })
      .subscribe({
        next: () => {
          this.isSaving = false;
          this.saveErrorMessage = '';
          void this.router.navigate(['/orders']);
        },
        error: (error) => {
          this.isSaving = false;
          this.saveErrorMessage =
            error?.error?.message || 'Unable to update this order right now. Please try again.';
        },
      });
  }

  get statusBadgeVariant(): StatusBadgeVariant {
    return this.order.status;
  }

  private mapOrderStatusToBadge(status: string): StatusBadgeVariant {
    switch (this.normalizeOrderStatus(status)) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'cancelled':
        return 'danger';
      case 'processing':
        return 'primary';
      case 'pending':
      default:
        return 'pending';
    }
  }

  private normalizeOrderStatus(status: string): UpdateOrderStatus {
    switch (status.trim().toLowerCase()) {
      case 'processing':
        return 'processing';
      case 'shipped':
      case 'ship order':
        return 'shipped';
      case 'delivered':
        return 'delivered';
      case 'cancelled':
      case 'canceled':
      case 'cancel order':
        return 'cancelled';
      case 'confirmed':
        return 'processing';
      case 'pending':
      default:
        return 'pending';
    }
  }

  private toTitleCase(value: string): string {
    if (!value) {
      return '-';
    }

    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  private getProductImage(product?: Product): string {
    if (!product) {
      return '/product-media.jpg';
    }

    const defaultVariation = product.variations.find((variation) => variation.isDefault);

    return defaultVariation?.defaultImage || defaultVariation?.defaultImg || product.image || '/product-media.jpg';
  }
}
