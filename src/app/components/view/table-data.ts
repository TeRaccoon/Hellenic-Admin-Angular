import { TableName } from '../../common/types/tables';
import { DataService } from '../../services/data.service';
import { TableService } from '../../services/table.service';

class TableData {
  private data: TableData;
  private tableName: TableName;
  private displayName: string;
  private displayNames: string[];
  private dataTypes: any;

  constructor(
    private dataService: DataService,
    private tableService: TableService,
    tableName: TableName
  ) {
    this.tableName = tableName;

    this.displayName = this.tableService.getTableDisplayName(tableName);
    this.setTableData();
  }

  async setTableData() {
    const tableData = await this.dataService.processGet('table', {
      filter: this.tableName,
    });

    this.data = tableData;
  }
}
