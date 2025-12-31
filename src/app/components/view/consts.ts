import { ViewMetadata } from '../../common/types/view/types';
import { ReloadEvent, TableData } from './types';

export const DEFAULT_RELOAD_EVENT: ReloadEvent = {
  loadTable: false,
  isToggle: false,
};

export const DEFAULT_TABLE_DATA: TableData = {
  data: [],
  display_data: [],
  display_names: [],
  editable: { columns: [], types: [], names: [], required: [], fields: [], values: [] },
  types: [],
};

export const DEFAULT_VIEW_METADATA: ViewMetadata = {
  loaded: false,
  entryLimit: 10,
  pageCount: 0,
  currentPage: 1,
};

export const DEFAULT_SORTED_COLUMN = { columnName: '', ascending: false };
