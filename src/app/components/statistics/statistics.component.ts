import { Component } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { Dayjs } from 'dayjs';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent {
  selected: { startDate: Dayjs; endDate: Dayjs; } | undefined;

  constructor(private statisticsService: StatisticsService) {}

  updateDateRange() {
    this.statisticsService.setDateRange(this.selected);
    console.log("🚀 ~ StatisticsComponent ~ updateDateRange ~ this.selected:", this.selected)
  }
}
