import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import { ReplacementData, ReplacementTextData, SelectReplacementData } from '../../types';
import { SelectData } from './types';

@Component({
  selector: 'app-dropselect',
  templateUrl: './dropselect.component.html',
  styleUrls: ['./dropselect.component.scss'],
})
export class DropselectComponent implements OnInit {
  @Input() selectData!: string;
  @Input() replacementData!: SelectData;
  @Input() disabled!: boolean;
  @Input() class!: string;
  @Input() field!: string;
  @Input() alternative = false;
  @Input() key!: string;
  @Input() text = false;

  @Output() update = new EventEmitter<ReplacementData>();
  @Output() updateText = new EventEmitter<ReplacementTextData>();

  spinner = faSpinner;

  open = false;
  loading = false;

  filteredData!: SelectData;

  debounceSearch = _.debounce((filter: string, text = false) => {
    this.performSearch(filter, text);
  }, 750);

  get filteredTextData(): string[] {
    return this.text ? (this.filteredData as string[]) : [];
  }

  get filteredReplacementData(): SelectReplacementData[] {
    return !this.text ? (this.filteredData as SelectReplacementData[]) : [];
  }

  ngOnInit() {
    this.filteredData = _.cloneDeep(this.replacementData);
  }

  onInputFocus() {
    this.open = true;
  }

  onInputBlur() {
    this.open = false;
  }

  filterDropSelect(event: Event) {
    const filter = (event.target as HTMLInputElement).value || '';

    if (this.replacementData?.length > 0) {
      this.loading = true;
      this.debounceSearch(filter, this.text);
    }
  }

  performSearch(filter: string, text: boolean | null = false) {
    if (!this.replacementData) return;

    if (text) {
      this.filter(filter);
    } else {
      this.textFilter(filter);
    }

    this.loading = false;
  }

  filter(filter: string) {
    const data = _.cloneDeep(this.replacementData) as string[];

    this.filteredData = data.filter((item) => item.toLowerCase().includes(filter.toLowerCase()));

    if (this.filteredData.length === 1) {
      this.updateSelectedTextReplacementDataFromKey(this.filteredData[0], this.key, this.field);
      this.open = false;
    }
  }

  textFilter(filter: string) {
    const data = _.cloneDeep(this.replacementData) as SelectReplacementData[];

    this.filteredData = data.filter((item) => item.replacement.toLowerCase().includes(filter.toLowerCase()));

    if (this.filteredData.length === 1 && this.field) {
      const match = this.filteredData[0] as SelectReplacementData;
      this.updateSelectedReplacementDataFromKey(match.id, match.replacement, this.key, this.field, this.alternative);
      this.open = false;
    }
  }

  updateSelectedReplacementDataFromKey(dataId: number, dataValue: string, key: string, field: string, alt: boolean) {
    this.update.emit({ dataId, dataValue, key, field, alt });
  }

  updateSelectedTextReplacementDataFromKey(dataValue: string, key: string, field: string) {
    this.updateText.emit({ dataValue, key, field });
  }
}
