import { ChartConfiguration, ChartType } from 'chart.js';
import dayjs, { Dayjs } from 'dayjs';

export interface chart {
  data: ChartConfiguration['data'];
  options: ChartConfiguration['options'];
  type: ChartType;
  heading: string;
  subheading: string;
  queries: string | string[];
}

export interface report {
  data: any[];
  headers: string[] | null;
  dataTypes: string[];
  formatted: boolean;
  filters: filter[];
  keys: string[];
}

export interface filter {
  name: string;
  predicate: Function;
}

export interface selectedDate {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

export interface chartLabels {
  primary: string | string[];
  secondary: string | string[];
}

export interface axisLabels {
  x: string;
  y: string;
}

export interface LineChartOptions {
  date: selectedDate;
  compareDate: selectedDate | null;
  queries: string | string[];
  chartLabels: chartLabels;
  axisLabels: axisLabels;
  displayLegend?: boolean;
  currency?: boolean;
  aboveZero?: boolean;
  displayTitles?: boolean;
  ignoreDate?: boolean;
  format?: string;
  fillLine?: boolean;
  colours?: string;
  backgroundColours?: string;
  secondaryColours?: string;
  secondaryBackgroundColours?: string;
  lineTension?: number;
}

export interface LineChartDataOptions {
  date: selectedDate | null;
  query: string;
  chartLabel: string;
  axisLabels: axisLabels;
  compareDate?: selectedDate;
  displayLegend?: boolean;
  currency?: boolean;
  aboveZero?: boolean;
  displayTitles?: boolean;
  ignoreDate?: boolean;
  format?: string;
  fillLine?: boolean;
  colour?: string;
  backgroundColour?: string;
  lineTension?: number;
  filter?: string;
}

export interface ReportOptions {
  headers: string[];
  dataTypes: string[];
  formatted: boolean;
  filters: {
    name: string;
    predicate: (value: any) => any;
  }[];
  keys: string[];
}

export interface SubheadingOptions {
  type: string;
  filter?: boolean;
}
