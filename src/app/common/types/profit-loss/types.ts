export type ProfitLossInput = {
  income: number;
  costs: number;
  expenses: number;
};

export type ProfitLossData = ProfitLossInput & {
  grossProfit: number;
  netProfit: number;
};

export type Cost = {
  cost: { category: string; total: number }[];
  total: number;
};

export type Totals = {
  income: number;
  costs: number;
  expenses: number;
  tax: number;
};
