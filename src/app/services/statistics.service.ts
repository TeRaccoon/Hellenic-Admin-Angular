import { Injectable } from '@angular/core';
import { Dayjs } from 'dayjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class StatisticsService {
    private dateRange = new BehaviorSubject<{ startDate: Dayjs; endDate: Dayjs; } | undefined>(undefined);
    private months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    private defaultColours = []

    getMonths() {
        return this.months;
    }

    getDateRange() {
        return this.dateRange.asObservable();
    }

    setDateRange(dateRange: any) {
        this.dateRange.next(dateRange);
    }

    getLineChartData(dataset: any[], label: string, backgroundColours: any[]) {        
        return {
            data: dataset,
            label: label,
            backgroundColor: backgroundColours[0]
        };
    }
}