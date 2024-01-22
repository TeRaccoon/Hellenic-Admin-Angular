import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FilterService {
    private tableFilter: string | null = null;

    setTableFilter(filter: string) {
        this.tableFilter = filter;
    }

    getTableFilter() {
        return this.tableFilter;
    }

    clearFilter() {
        this.tableFilter = null;
    }
}