import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import { ReplacementData, ReplacementTextData } from '../../types';

@Component({
  selector: 'app-dropselect',
  templateUrl: './dropselect.component.html',
  styleUrls: ['./dropselect.component.scss'],
})
export class DropselectComponent implements OnInit {
  @Input() selectData!: string;
  @Input() replacementData!: any[];
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

  filteredData!: any[];
  selectedData: { data: any; id: number } | undefined = undefined;
  selectedText = '';

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
        this.updateSelectedTextReplacementDataFromKey(this.selectedText, this.key, this.field);
      } else if (this.field) {
        this.updateSelectedReplacementDataFromKey(
          this.filteredData[0].id,
          this.filteredData[0].replacement,
          this.key,
          this.field,
          this.alternative
        );
      }
      this.open = false;
    }
    this.loading = false;
  }

  updateSelectedReplacementDataFromKey(dataId: number, dataValue: string, key: string, field: string, alt: boolean) {
    this.update.emit({ dataId, dataValue, key, field, alt });
  }

  updateSelectedTextReplacementDataFromKey(dataValue: string, key: string, field: string) {
    this.updateText.emit({ dataValue, key, field });
  }
}
