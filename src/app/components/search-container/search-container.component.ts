import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import _ from 'lodash';
import { SEARCH_ICONS } from '../../common/icons/search-icons';

@Component({
  selector: 'app-search-container',
  templateUrl: './search-container.component.html',
  styleUrls: ['./search-container.component.scss'],
})
export class SearchContainerComponent {
  @Input() options: string[] = [];
  @Input() placeholder: string = 'Search...';

  @Output() optionSelected = new EventEmitter<string>();
  @Output() filterRemoved = new EventEmitter<any>();

  icons = SEARCH_ICONS;

  searchInput = '';
  selectedOption = '';
  filteredOptions: string[] = [];
  searching = false;

  searchDropdownVisible = false;

  debounceSearch: (filter: string) => void = _.debounce(
    (filter: string) => this.performSearch(filter),
    750
  );

  ngOnInit() {
    this.debounceSearch = _.debounce(this.performSearch.bind(this), 750);
    this.filteredOptions = this.options;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      this.filteredOptions = this.options;
    }
  }

  searchOptions(event: Event) {
    this.searching = true;
    const filter = String((event.target as HTMLInputElement).value);

    this.debounceSearch(filter);
  }

  selectOption(option: string) {
    this.searchInput = option;
    this.selectedOption = option;
    this.optionSelected.emit(option);
  }

  clearSelectedOption() {
    this.searchInput = '';
    this.selectedOption = '';
    this.filteredOptions = this.options;
    this.filterRemoved.emit();
  }

  async performSearch(filter: string) {
    this.filteredOptions = this.options.filter((item: string) =>
      item.toUpperCase().includes(filter.toUpperCase())
    );

    this.searching = false;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    if (!this.isDescendantOfSearchContainer(clickedElement)) {
      this.searchDropdownVisible = false;
    }
  }

  private isDescendantOfSearchContainer(element: HTMLElement): boolean {
    let currentElement: HTMLElement | null = element;
    while (currentElement) {
      if (currentElement.classList.contains('search-container')) {
        return true;
      }
      currentElement = currentElement?.parentElement;
    }
    return false;
  }
}
