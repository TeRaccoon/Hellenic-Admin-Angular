import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { faPrint, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-print-layout',
  templateUrl: './print-layout.component.html',
  styleUrls: ['./print-layout.component.scss']
})
export class PrintLayoutComponent {
  faArrowLeft = faArrowLeft;
  faPrint = faPrint;

  constructor(private _location: Location) { }

  back() {
    this._location.back()
  }

  async print() {

    const badge = document.querySelector('.grecaptcha-badge') as HTMLElement;
    if (badge) {
      badge.style.display = 'none';
    }

    // Trigger the print dialog
    setTimeout(() => {
      window.print();

      // Restore the badge visibility after printing
      if (badge) {
        badge.style.display = 'block';
      }
    }, 500); // Adjust the delay as needed
  }
}
