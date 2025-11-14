import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormService } from '../form/service';
import { FormType } from '../form/types';
import { ICONS } from './icons';
import { NavbarService } from './service';
import { Notifications } from './types';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  @ViewChild('notificationDropdown') notificationDropdown!: ElementRef;
  @ViewChild('notificationIcon') notificationIcon!: ElementRef;

  @ViewChild('userOptions') userOptions!: ElementRef;
  @ViewChild('userIcon') userIcon!: ElementRef;

  icons = ICONS;

  tablelessOptions: string[] = [];

  notificationVisible = false;
  userOptionsVisible = false;
  searchDropdownVisible = false;
  interactive = false;

  notifications: Notifications = {};

  constructor(
    private formService: FormService,
    private renderer: Renderer2,
    private service: NavbarService
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      const target = e.target as Node;

      const clickedInsideNotification =
        this.notificationDropdown?.nativeElement.contains(target) ||
        this.notificationIcon?.nativeElement.contains(target);

      if (!clickedInsideNotification) {
        this.notificationVisible = false;
      }

      const clickedInsideUser =
        this.userOptions?.nativeElement.contains(target) || this.userIcon?.nativeElement.contains(target);

      if (!clickedInsideUser) {
        this.userOptionsVisible = false;
        this.interactive = false;
      }
    });
  }

  ngOnInit() {
    this.getNotifications();
  }

  toggleNotificationDropdown() {
    this.userOptionsVisible = false;
    this.notificationVisible = !this.notificationVisible;
    if (this.notificationVisible) {
      setTimeout(() => {
        this.interactive = this.notificationVisible;
      }, 1000);
    } else {
      this.interactive = false;
    }
  }

  toggleUserOptions() {
    this.notificationVisible = false;
    this.userOptionsVisible = !this.userOptionsVisible;
    if (this.userOptionsVisible) {
      setTimeout(() => {
        this.interactive = this.userOptionsVisible;
      }, 1000);
    } else {
      this.interactive = false;
    }
  }

  async getNotifications() {
    await this.getPendingCustomers();
    await this.getNewInvoices();
  }

  private async getPendingCustomers() {
    const pendingCustomers = await this.service.getPendingCustomers();
    if (pendingCustomers.length > 0) {
      this.notifications['Customers pending approval'] = pendingCustomers;
    }
  }

  private async getNewInvoices() {
    const invoices = await this.service.getNewInvoices();
    if (invoices.length > 0) {
      this.notifications['New invoices'] = invoices;
    }
  }

  async logout() {
    this.userOptionsVisible = false;

    await this.service.logout();
  }

  changePassword() {
    this.userOptionsVisible = false;
    this.formService.setFormVisibility(FormType.ChangePassword, true);
  }

  notificationKeys() {
    return Object.keys(this.notifications);
  }
}
