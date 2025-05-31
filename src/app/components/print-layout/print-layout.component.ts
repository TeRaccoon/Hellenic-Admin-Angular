import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { faArrowLeft, faPrint } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-print-layout',
  templateUrl: './print-layout.component.html',
  styleUrls: ['./print-layout.component.scss'],
})
export class PrintLayoutComponent {
  faArrowLeft = faArrowLeft;
  faPrint = faPrint;

  constructor(private _location: Location) {}

  back() {
    this._location.back();
  }

  async print() {
    const badge = document.querySelector('.grecaptcha-badge') as HTMLElement;
    if (badge) {
      badge.style.display = 'none';
    }

    setTimeout(() => {
      window.print();

      if (badge) {
        badge.style.display = 'block';
      }
    }, 500);
  }
}
