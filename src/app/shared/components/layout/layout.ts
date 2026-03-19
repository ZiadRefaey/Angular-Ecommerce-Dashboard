import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  host: {
    class: 'w-full h-screen grid grid-cols-1 md:grid-cols-[auto_1fr] grid-rows-[64px_1fr]',
  },
})
export class Layout {}
