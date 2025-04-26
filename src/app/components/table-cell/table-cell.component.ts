import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { COLUMN_RESTRICTIONS } from './consts';

@Component({
  selector: 'app-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrl: './table-cell.component.scss',
})
export class TableCellComponent {
  @Input() tableName!: string;
  @Input() dataType!: string;
  @Input() item!: string;

  constructor(private authService: AuthService) {}

  canDisplayColumn(column: string): boolean {
    const accessLevel = this.authService.getAccessLevel();
    const tableKey = this.tableName;
    const comboKey = `${this.tableName}:${accessLevel}`;

    const restrictedColumns = [
      ...(COLUMN_RESTRICTIONS[accessLevel] || []),
      ...(COLUMN_RESTRICTIONS[tableKey] || []),
      ...(COLUMN_RESTRICTIONS[comboKey] || []),
    ];

    return !restrictedColumns.includes(column);
  }
}
