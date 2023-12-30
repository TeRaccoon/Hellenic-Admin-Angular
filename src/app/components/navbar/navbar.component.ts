import { Component } from '@angular/core';
import { faSearch, faBell, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';

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
}
