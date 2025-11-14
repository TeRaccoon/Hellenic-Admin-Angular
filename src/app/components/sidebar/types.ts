export interface TableCategories {
  Customers: Table[];
  Products: Table[];
  Supply: Table[];
  Finance: Table[];
  Website: Table[];
  Admin: Table[];
}

interface Table {
  tableName: string;
  displayName: string;
}
