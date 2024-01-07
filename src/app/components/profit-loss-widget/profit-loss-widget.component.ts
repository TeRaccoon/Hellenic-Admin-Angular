import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-profit-loss-widget',
  templateUrl: './profit-loss-widget.component.html',
  styleUrls: ['./profit-loss-widget.component.scss']
})
export class ProfitLossWidgetComponent {
  startDate: string = '';
  endDate: string = '';

  constructor(private dataService: DataService) {}

  calculateProfitLoss() {
    
  }
}
