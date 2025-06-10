import { ProductDetails } from "./inventory";

export interface TransactionItem {
  _id: string | ProductDetails; // could be just ID or populated Product object
  count: number;
  product?: ProductDetails;
}

export interface UserRef {
  _id: string;
  name: string;
}

export interface Transaction {
  _id: string;
  items: TransactionItem[];
  cashier: string | UserRef;
  partsman: string | UserRef;
  total: number;
  discount: number;
  status: 'completed' | 'pending' | 'cancelled' | 'reserved';
  createdAt: string;
  updatedAt: string;
  invoiceId?: string;
}
export interface TransactionPeriodStats {
  total: number;
  transactionCount: number;
  itemsSold: number;
  avgTransactionValue: number;
  avgItemsPerTransaction: number;
}

export type TransactionStatisticsType = {
  today: TransactionPeriodStats;
  yesterday: TransactionPeriodStats;
  thisWeek: TransactionPeriodStats;
  lastWeek: TransactionPeriodStats;
  thisMonth: TransactionPeriodStats;
  lastMonth: TransactionPeriodStats;
  thisYear: TransactionPeriodStats;
  lastYear: TransactionPeriodStats;
  changeTodayVsYesterday: number;
  changeMonthVsLast: number;
}

export interface GetMyTransactionsStatisticsResponse {
  status: "success" | "failed";
  data: TransactionStatisticsType;
}

export type TransactionPeriodKey = keyof Pick<
  TransactionStatisticsType,
  | "today"
  | "yesterday"
  | "thisWeek"
  | "lastWeek"
  | "thisMonth"
  | "lastMonth"
  | "thisYear"
  | "lastYear"
>;

export interface TrendData {
  total_sales: number;
  total_income: number;
  active_products: number;
}

export interface SalesDataPoint {
  day?: string;
  week?: string;
  month?: string;
  amount: number;
}

export interface ProductSummary {
  _id: string;
  name: string;
  totalSold: number;
  percentage?: number;
}

export interface SalesStatistics {
  total_sales: number;
  total_income: number;
  total_expenses: number;
  active_products: number;
  trends: TrendData;
  daily_sales: SalesDataPoint[];
  weekly_sales: SalesDataPoint[];
  monthly_sales: SalesDataPoint[];
  top_selling_products_by_period: ProductSummary[];
}