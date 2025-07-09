import { TableName, TableTypeMap } from '../../common/types/tables';

export interface TableColumns {
  columnNames: string[];
  columns?: TableTypeMap[TableName];
  dataTypes: string[];
}
