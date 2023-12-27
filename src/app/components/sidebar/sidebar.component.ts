import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(private router: Router) {}

  changeTable(event: Event) {
    const option = event.target as HTMLInputElement;
    let value = option.value;
    this.router.navigate(['/view'], { queryParams: {table: value } })
  }
}
