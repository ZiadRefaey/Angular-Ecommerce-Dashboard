import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-side-bar',
  standalone: false,
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
  host: {
    class: 'contents',
  },
})
export class SideBar {
  private router = inject(Router);
  private authService = inject(AuthService);
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  currentUrl = '';
  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
      });
  }
  logout() {
    this.authService.logout();
    console.log('clicked');
  }

  closeSidebar(): void {
    this.closed.emit();
  }
}
