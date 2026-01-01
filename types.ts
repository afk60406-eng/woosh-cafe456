export interface MenuItem {
  name: string;
  price: number | string; // Some prices are ranges or text like "洽櫃台"
  tags?: string[];
  description?: string;
  soldOut?: boolean;
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export interface SalesData {
  name: string;
  revenue: number;
  cost: number;
  profit: number;
}