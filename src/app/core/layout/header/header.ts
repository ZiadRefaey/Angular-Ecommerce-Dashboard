import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, of, switchMap, takeUntil, tap, catchError, map, filter } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../../features/products/models/products.model';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly destroy$ = new Subject<void>();
  private readonly searchInput$ = new Subject<string>();
  private selectedProductRoute = '';

  searchTerm = '';
  searchResults: Product[] = [];
  isLoading = false;
  isDropdownOpen = false;
  isMobileSearchOpen = false;
  errorMessage = '';
  @Output() sidebarToggle = new EventEmitter<void>();

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects !== this.selectedProductRoute) {
          this.clearSearch();
        }
      });

    this.searchInput$
      .pipe(
        tap((term) => {
          if (!term.trim()) {
            this.isLoading = false;
            this.errorMessage = '';
            this.searchResults = [];
            this.isDropdownOpen = false;
            return;
          }

          this.isLoading = true;
          this.errorMessage = '';
          this.isDropdownOpen = true;
        }),
        switchMap((term) => {
          const normalizedTerm = term.trim().toLowerCase();

          if (!normalizedTerm) {
            return of([] as Product[]);
          }

          return this.productsService.getProducts().pipe(
            map((response) => this.getClosestResults(response.data, normalizedTerm)),
            catchError(() => {
              this.errorMessage = 'Unable to search products right now.';
              return of([] as Product[]);
            }),
          );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((products) => {
        if (!this.searchTerm.trim()) {
          return;
        }

        this.searchResults = products;
        this.isLoading = false;
        this.isDropdownOpen = true;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(value: string): void {
    this.searchTerm = value;
    this.searchInput$.next(value);
  }

  onSearchFocus(): void {
    if (this.searchTerm.trim()) {
      this.isDropdownOpen = true;
    }
  }

  openMobileSearch(): void {
    this.isMobileSearchOpen = true;
  }

  closeMobileSearch(): void {
    this.isMobileSearchOpen = false;
    this.isDropdownOpen = false;
  }

  navigateToProduct(product: Product): void {
    this.searchTerm = product.name;
    this.isDropdownOpen = false;
    this.searchResults = [];
    this.selectedProductRoute = `/products/${product._id}`;
    this.router.navigate(['/products', product._id]);
  }

  get showEmptyState(): boolean {
    return !this.isLoading && !this.errorMessage && !!this.searchTerm.trim() && !this.searchResults.length;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isDropdownOpen = false;
      this.isMobileSearchOpen = false;
    }
  }

  private clearSearch(): void {
    this.searchTerm = '';
    this.searchResults = [];
    this.isLoading = false;
    this.isDropdownOpen = false;
    this.isMobileSearchOpen = false;
    this.errorMessage = '';
    this.selectedProductRoute = '';
  }

  private getClosestResults(products: Product[], normalizedTerm: string): Product[] {
    return products
      .filter((product) => this.matchesSearch(product, normalizedTerm))
      .sort((firstProduct, secondProduct) => {
        const firstRank = this.getProductRank(firstProduct, normalizedTerm);
        const secondRank = this.getProductRank(secondProduct, normalizedTerm);

        if (firstRank !== secondRank) {
          return firstRank - secondRank;
        }

        return firstProduct.name.localeCompare(secondProduct.name);
      })
      .slice(0, 4);
  }

  private matchesSearch(product: Product, normalizedTerm: string): boolean {
    return [product.name, product.description]
      .map((value) => value.toLowerCase())
      .some((value) => value.includes(normalizedTerm));
  }

  private getProductRank(product: Product, normalizedTerm: string): number {
    const productName = product.name.toLowerCase();
    const description = product.description.toLowerCase();

    if (productName.startsWith(normalizedTerm)) {
      return 0;
    }

    if (productName.includes(normalizedTerm)) {
      return 1;
    }

    if (description.startsWith(normalizedTerm)) {
      return 2;
    }

    return 3;
  }
}
