export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  size: string;
  color: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  sku: string;
  dateAdded: string;
}

export interface Sale {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  date: string;
  timestamp: number;
}

export interface User {
  username: string;
  password: string;
}
