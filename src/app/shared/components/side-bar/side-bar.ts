import { Component } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  standalone: false,
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
  host: {
    class:
      'w-64 bg-gray-900 h-screen text-white row-span-2 flex items-start justify-start flex-col',
  },
})
export class SideBar {}
