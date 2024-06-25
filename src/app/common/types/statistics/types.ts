import { ChartConfiguration, ChartType } from 'chart.js';

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
    type: string,
    formatted: boolean
}

export const REPORT_TYPE = {
    list: 'LIST',
    table: 'TABLE'
};

interface query {
    dayQueries: string[],
    monthQueries: string[],
}