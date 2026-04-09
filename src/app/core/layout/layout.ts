import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  host: {
    class: 'w-full h-screen grid grid-cols-1 lg:grid-cols-[auto_1fr] grid-rows-[64px_1fr] bg-white',
  },
})
export class Layout {
  private router = inject(Router);
  currentUrl = '';
  isSidebarOpen = false;
  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
        this.closeSidebar();
      });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}
