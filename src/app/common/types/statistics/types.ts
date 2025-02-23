import { ChartConfiguration, ChartType } from 'chart.js';
import dayjs, { Dayjs } from 'dayjs';

export interface Chart {
  data: ChartConfiguration['data'];
  options: ChartConfiguration['options'];
  type: ChartType;
  heading: string;
  subheading: string;
  queries: string | string[];
}

export interface Report {
  data: any[];
  headers: string[] | null;
  dataTypes: string[];
  formatted: boolean;
  filters: Filter[];
  keys: string[];
  sort?: boolean;
}

export interface Filter {
  name: string;
  predicate: Function;
}

export interface SelectedDate {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

export interface ChartLabels {
  primary: string | string[];
  secondary: string | string[];
}

export interface AxisLabels {
  x: string;
  y: string;
}

export interface LineChartOptions {
  date?: SelectedDate;
  compareDate?: SelectedDate | null;
  queries: string | string[];
  chartLabels?: ChartLabels;
  axisLabels: AxisLabels;
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
  date: SelectedDate | null;
  query: string;
  chartLabel: string;
  axisLabels: AxisLabels;
  compareDate?: SelectedDate;
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
  type: SubheadingType;
  filter?: boolean;
}

export interface LineChartConfig {
  lineChartOptions: LineChartOptions,
  subheadingOptions: SubheadingOptions,
  reportOptions: ReportOptions,
  heading: string,
  filter?: string
}

export enum SubheadingType {
  AverageCurrency = 'average-currency',
  AverageDualComparative = 'average-dual-comparative'
}
