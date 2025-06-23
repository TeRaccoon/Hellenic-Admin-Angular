import { Component, HostListener, OnInit } from '@angular/core';
import _ from 'lodash';
import { SearchResult } from '../../../../common/types/table';
import { SearchService } from '../../../../services/search.service';
import { TableService } from '../../../../services/table.service';
import { TABLE_OPTIONS } from '../../consts';
import { ICONS } from '../../icons';
import { NavbarService } from '../../service';

@Component({
  selector: 'app-search-dropdown',
  templateUrl: './search-dropdown.component.html',
  styleUrl: './search-dropdown.component.scss',
})
export class SearchDropdownComponent implements OnInit {
  public searchDropdownVisible = false;
  public searching = false;
  public searchInput = '';

  public icons = ICONS;

  public filteredTableOptions = TABLE_OPTIONS;
  public searchResults: SearchResult[] = [];

  private tableOptions = TABLE_OPTIONS;

  private debounceSearch: (filter: string) => void = _.debounce((filter: string) => this.performSearch(filter), 750);

  constructor(
    private searchService: SearchService,
    private service: NavbarService,
    private tableService: TableService
  ) {}

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    if (!this.service.isDescendantOfSearchContainer(clickedElement)) {
      this.searchDropdownVisible = false;
    }
  }

  ngOnInit() {
    this.debounceSearch = _.debounce(this.performSearch.bind(this), 750);
  }

  searchTables(event: Event) {
    this.searching = true;
    const filter = String((event.target as HTMLInputElement).value);
    this.filteredTableOptions = this.tableOptions.filter(
      (option) => option.display && option.display.toUpperCase().includes(filter.toUpperCase())
    );
    this.debounceSearch(filter);
  }

  async performSearch(filter: string) {
    if (filter != '') {
      this.searchResults = await this.searchService.search(filter);
    } else {
      this.searchResults = [];
    }

    this.searchDropdownVisible = true;
    this.searching = false;
  }

  changeTable(table: string) {
    this.searchDropdownVisible = false;
    this.tableService.changeTable(table);
  }

  goToRow(table: string, matchedValue: string) {
    this.service.goToRow(table, matchedValue);
    this.searchDropdownVisible = false;
  }
}
