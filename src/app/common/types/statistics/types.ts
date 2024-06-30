import { ChartConfiguration, ChartType } from 'chart.js';
import dayjs, { Dayjs } from 'dayjs';

export interface chart {
    data: ChartConfiguration['data'],
    options: ChartConfiguration['options'], 
    type: ChartType, 
    heading: string, 
    subheading: string,
    query: query,
}

export interface report {
    data: any[],
    headers: string[] | null,
    dataTypes: string[],
    formatted: boolean,
    filters: filter[]
}

interface query {
    dayQueries: string[],
    monthQueries: string[],
}

export interface filter {
    name: string,
    predicate: Function,
}

export interface selectedDate {
    startDate: Dayjs,
    endDate: Dayjs
}