export type StockStatus = "in_stock" | "low_stock" | "sold_out";

export interface ShoeSizeEntry {
  sku: string;
  style_code: string;
  product_name: string;
  colorway: string;
  price: number;
  size_label: string;
  size_us_men: number;
  size_us_women: number;
  size_eu: string;
  display_order: number;
  in_stock: boolean;
  stock_quantity: number;
  stock_status: StockStatus;
  launch_date: string;
}
