import { Component } from '@angular/core';
import { faSearch, faBell, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  faBell = faBell;
  faEnvelope = faEnvelope;
  faUser = faUser;
  faSearch = faSearch;

  dropDownVisible = false;

  notifications = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.getNotifications();
  }

  toggleNotificationDropdown() {
    this.dropDownVisible = !this.dropDownVisible;
  }

  getNotifications() {
    this.dataService.collectData('invoices-due-today', '0').subscribe((data: any) => {
      this.notifications = data;
    });
  }
}
