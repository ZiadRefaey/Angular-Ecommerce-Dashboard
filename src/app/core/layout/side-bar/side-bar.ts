import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-side-bar',
  standalone: false,
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
  host: {
    class:
      'w-64 bg-gray-900 h-[100%] text-white row-span-2 flex items-start justify-start flex-col',
  },
})
export class SideBar {
  private router = inject(Router);
  currentPath = '';
  ngOnInit() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.currentPath = this.router.url;
    });
  }
}
