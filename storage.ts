import { InventoryItem, Sale, User } from '../types';

const STORAGE_KEYS = {
  INVENTORY: 'clothing_inventory',
  SALES: 'clothing_sales',
  USER: 'clothing_user',
  AUTH: 'clothing_auth',
};

// Initialize with sample data if empty
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
    const sampleInventory: InventoryItem[] = [
      {
        id: '1',
        name: 'Cotton T-Shirt',
        category: 'Tops',
        size: 'M',
        color: 'Blue',
        quantity: 150,
        costPrice: 5.00,
        sellingPrice: 15.00,
        sku: 'TS-BLU-M-001',
        dateAdded: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Denim Jeans',
        category: 'Bottoms',
        size: 'L',
        color: 'Dark Blue',
        quantity: 80,
        costPrice: 20.00,
        sellingPrice: 45.00,
        sku: 'JN-DBL-L-002',
        dateAdded: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Hoodie',
        category: 'Outerwear',
        size: 'XL',
        color: 'Black',
        quantity: 60,
        costPrice: 15.00,
        sellingPrice: 40.00,
        sku: 'HD-BLK-XL-003',
        dateAdded: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Summer Dress',
        category: 'Dresses',
        size: 'S',
        color: 'Floral',
        quantity: 45,
        costPrice: 18.00,
        sellingPrice: 50.00,
        sku: 'DR-FLR-S-004',
        dateAdded: new Date().toISOString(),
      },
      {
        id: '5',
        name: 'Athletic Shorts',
        category: 'Bottoms',
        size: 'M',
        color: 'Grey',
        quantity: 120,
        costPrice: 8.00,
        sellingPrice: 22.00,
        sku: 'SH-GRY-M-005',
        dateAdded: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(sampleInventory));
  }

  if (!localStorage.getItem(STORAGE_KEYS.SALES)) {
    const now = Date.now();
    const sampleSales: Sale[] = [
      // Today
      {
        id: '1',
        itemId: '1',
        itemName: 'Cotton T-Shirt',
        quantity: 5,
        pricePerUnit: 15.00,
        totalAmount: 75.00,
        date: new Date().toISOString(),
        timestamp: now,
      },
      // Yesterday
      {
        id: '2',
        itemId: '2',
        itemName: 'Denim Jeans',
        quantity: 3,
        pricePerUnit: 45.00,
        totalAmount: 135.00,
        date: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
        timestamp: now - 24 * 60 * 60 * 1000,
      },
      // 3 days ago
      {
        id: '3',
        itemId: '3',
        itemName: 'Hoodie',
        quantity: 2,
        pricePerUnit: 40.00,
        totalAmount: 80.00,
        date: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
        timestamp: now - 3 * 24 * 60 * 60 * 1000,
      },
      // Last week
      {
        id: '4',
        itemId: '4',
        itemName: 'Summer Dress',
        quantity: 4,
        pricePerUnit: 50.00,
        totalAmount: 200.00,
        date: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
        timestamp: now - 7 * 24 * 60 * 60 * 1000,
      },
      // Last month
      {
        id: '5',
        itemId: '5',
        itemName: 'Athletic Shorts',
        quantity: 10,
        pricePerUnit: 22.00,
        totalAmount: 220.00,
        date: new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString(),
        timestamp: now - 30 * 24 * 60 * 60 * 1000,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sampleSales));
  }

  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    const defaultUser: User = {
      username: 'admin',
      password: 'admin123',
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
  }
};

// Inventory operations
export const getInventory = (): InventoryItem[] => {
  initializeData();
  const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
  return data ? JSON.parse(data) : [];
};

export const addInventoryItem = (item: InventoryItem) => {
  const inventory = getInventory();
  inventory.push(item);
  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
};

export const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
  const inventory = getInventory();
  const index = inventory.findIndex(item => item.id === id);
  if (index !== -1) {
    inventory[index] = { ...inventory[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }
};

export const deleteInventoryItem = (id: string) => {
  const inventory = getInventory();
  const filtered = inventory.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(filtered));
};

// Sales operations
export const getSales = (): Sale[] => {
  initializeData();
  const data = localStorage.getItem(STORAGE_KEYS.SALES);
  return data ? JSON.parse(data) : [];
};

export const addSale = (sale: Sale) => {
  const sales = getSales();
  sales.push(sale);
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  
  // Update inventory quantity
  const inventory = getInventory();
  const item = inventory.find(i => i.id === sale.itemId);
  if (item && item.quantity >= sale.quantity) {
    updateInventoryItem(sale.itemId, { quantity: item.quantity - sale.quantity });
  }
};

// Auth operations
export const login = (username: string, password: string): boolean => {
  initializeData();
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  if (userData) {
    const user: User = JSON.parse(userData);
    if (user.username === username && user.password === password) {
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      return true;
    }
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH);
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
};
