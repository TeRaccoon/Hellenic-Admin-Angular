export interface columnFilter {
    column: string,
    filter: string,
    caseSensitive: boolean
};

export interface columnDateFilter {
    column: string,
    startDate: Date,
    endDate: Date
};

export interface sortedColumn {
    columnName: string,
    ascending: boolean
};

export interface viewMetadata {
    loaded: boolean,
    entryLimit: number,
    pageCount: number,
    currentPage: number
}

export interface FilterData {
    searchFilter: string,
    searchFilterApplied: boolean,
}