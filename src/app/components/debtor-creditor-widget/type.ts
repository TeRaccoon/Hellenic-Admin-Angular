export interface Config {
  ranges: DateRanges[];
  labels: Labels[];
}

export interface DateRanges {
  label: string;
  data: (number | null)[];
}

export interface Labels {
  header: string;
  type: string;
}
