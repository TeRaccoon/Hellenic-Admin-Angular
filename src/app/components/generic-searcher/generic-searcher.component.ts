import { Component, HostListener } from '@angular/core';
import { NavbarService } from '../navbar/service';
import { SEARCHER_ICONS } from './icons';

@Component({
  selector: 'app-generic-searcher',
  templateUrl: './generic-searcher.component.html',
  styleUrl: './generic-searcher.component.scss',
})
export class GenericSearcherComponent {
  public searchDropdownVisible = false;
  public searching = false;
  public searchInput = '';

  public icons = SEARCHER_ICONS;

  constructor(private service: NavbarService) {}

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    if (!this.service.isDescendantOfSearchContainer(clickedElement)) {
      this.searchDropdownVisible = false;
    }
  }

  public close() {
    this.searchDropdownVisible = false;
  }

  public open() {
    this.searchDropdownVisible = true;
  }

  public search() {
    this.searching = true;
  }

  public stopSearch() {
    this.searching = false;
  }
}
