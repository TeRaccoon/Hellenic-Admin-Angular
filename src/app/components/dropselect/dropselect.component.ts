import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import _ from 'lodash';
import { ReplacementData } from '../../common/types/forms/types';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dropselect',
  templateUrl: './dropselect.component.html',
  styleUrls: ['./dropselect.component.scss']
})
export class DropselectComponent implements OnInit {
  @Input() selectData: any;
  @Input() replacementData!: { id: Number; replacement: string }[];
  @Input() disabled!: boolean;
  @Input() class!: string;
  @Input() field!: string;
  @Input() alterative!: boolean;
  @Input() key: any;
  @Input() text = false;

  @Output() update = new EventEmitter<ReplacementData>();

  spinner = faSpinner;

  open = false;
  loading = false;

  filteredData: any;
  selectedData: { data: any; id: number } | undefined = undefined;
  selectedText: string = '';

  constructor() { }

  ngOnInit() {
    this.filteredData = _.cloneDeep(this.replacementData);
  }

  onInputFocus() {
    this.open = true;
  }

  onInputBlur() {
    this.open = false;
  }

  filterDropSelect(event: any) {
    const filter = event.target.value || '';
    this.selectedData = filter;

    if (this.replacementData?.length > 0) {
      this.loading = true;
      this.debounceSearch(filter, this.text);
    }
  }

  debounceSearch = _.debounce((filter: string, text = false) => {
    this.performSearch(filter, text);
  }, 750);

  performSearch(filter: string, text: boolean | null = false) {
    if (!this.replacementData) return;

    this.filteredData = _.cloneDeep(this.replacementData).filter((data: any) =>
      text
        ? data?.toLowerCase().includes(filter.toLowerCase())
        : data.replacement?.toLowerCase().includes(filter.toLowerCase())
    );

    if (this.filteredData.length === 1) {
      if (text) {
        this.selectedText = this.filteredData[0];
      } else if (this.field) {
        this.updateSelectedReplacementDataFromKey(
          this.filteredData[0].id,
          this.filteredData[0].replacement,
          this.key,
          this.field,
          this.alterative
        );
      }
      this.open = false;
    }
    this.loading = false;
  }

  updateSelectedReplacementDataFromKey(
    dataId: number,
    dataValue: string,
    key: string,
    field: string,
    alt: boolean
  ) {
    this.update.emit({ dataId, dataValue, key, field, alt });
  }
}
