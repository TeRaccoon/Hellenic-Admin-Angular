import { Component, OnInit, ViewChild } from '@angular/core';
import _ from 'lodash';
import { SearchResult } from '../../../../common/types/table';
import { SearchService } from '../../../../services/search.service';
import { TableService } from '../../../../services/table.service';
import { GenericSearcherComponent } from '../../../generic-searcher/generic-searcher.component';
import { TABLE_OPTIONS } from '../../consts';
import { ICONS } from '../../icons';
import { NavbarService } from '../../service';

@Component({
  selector: 'app-search-dropdown',
  templateUrl: './search-dropdown.component.html',
  styleUrl: './search-dropdown.component.scss',
})
export class SearchDropdownComponent implements OnInit {
  @ViewChild('searchComponent', { static: false }) searchComponent!: GenericSearcherComponent;

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

  ngOnInit() {
    this.debounceSearch = _.debounce(this.performSearch.bind(this), 750);
  }

  searchTables(event: Event) {
    this.searchComponent.search();
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

    this.searchComponent.open();
    this.searchComponent.stopSearch();
  }

  changeTable(table: string) {
    this.tableService.changeTable(table);
    this.searchComponent.searchDropdownVisible = false;
  }

  goToRow(table: string, matchedValue: string) {
    this.service.goToRow(table, matchedValue);
    this.searchComponent.close();
  }
}
