export interface SearchResult {
    tableName: string,
    id: number,
    matchedValue: string
};

export interface Extras {
    StockData: any,
    Images: { [key: string]: any }[]
};