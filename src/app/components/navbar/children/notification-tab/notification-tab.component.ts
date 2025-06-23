import { Component, Input } from '@angular/core';
import { ICONS } from '../../icons';
import { Notifications } from '../../types';

@Component({
  selector: 'app-notification-tab',
  templateUrl: './notification-tab.component.html',
  styleUrl: './notification-tab.component.scss',
})
export class NotificationTabComponent {
  public icons = ICONS;

  @Input() interactive = false;
  @Input() notifications: Notifications = {};
  @Input() visible = false;

  stopEvent(event: Event) {
    event.stopPropagation();
  }

  notificationKeys() {
    return Object.keys(this.notifications);
  }

  removeNotification(key: string, notification: string) {
    this.notifications[key] = this.notifications[key].filter((n) => n != notification);

    if (this.notifications[key].length == 0) {
      delete this.notifications[key];
    }
  }
}
