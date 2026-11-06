import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { getInventory, getSales } from '../utils/storage';
import { InventoryItem, Sale } from '../types';
import Layout from '../components/Layout';
import { Package, DollarSign, TrendingUp, ShoppingBag, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    setInventory(getInventory());
    setSales(getSales());
  }, []);

  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalStockValue = inventory.reduce((sum, item) => sum + item.costPrice * item.quantity, 0);
  const potentialRevenue = inventory.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);

  const now = Date.now();
  const monthlySales = sales
    .filter((s) => s.timestamp >= now - 30 * 24 * 60 * 60 * 1000)
    .reduce((sum, s) => sum + s.totalAmount, 0);

  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const currentMonthName = new Date().toLocaleDateString('en-US', { month: 'long' });

  const todaySales = sales
    .filter((s) => new Date(s.date).toLocaleDateString('en-US', { weekday: 'long' }) === todayName &&
      new Date(s.date).toDateString() === new Date().toDateString())
    .reduce((sum, s) => sum + s.totalAmount, 0);

  const thisMonthSales = sales
    .filter((s) => new Date(s.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) ===
      new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))
    .reduce((sum, s) => sum + s.totalAmount, 0);

  const lowStock = inventory.filter((item) => item.quantity < 20);

  const recentSales = [...sales]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Units</CardTitle>
              <Package className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">{inventory.length} products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Stock Value</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalStockValue.toFixed(2)}</div>
              <p className="text-xs text-gray-500 mt-1">At cost price</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Potential Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${potentialRevenue.toFixed(2)}</div>
              <p className="text-xs text-gray-500 mt-1">If all stock sells</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
              <ShoppingBag className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${thisMonthSales.toFixed(2)}</div>
              <p className="text-xs text-gray-500 mt-1">{currentMonthName}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's snapshot */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Today — {todayName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">${todaySales.toFixed(2)}</div>
              <p className="text-sm text-gray-500 mt-1">in sales today</p>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500 mb-1">Month ({currentMonthName})</p>
                <div className="text-lg font-semibold">${monthlySales.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Sales */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {recentSales.length === 0 ? (
                <p className="text-sm text-gray-500">No sales recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentSales.map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{sale.itemName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(sale.date).toLocaleDateString('en-US', {
                            weekday: 'short', month: 'short', day: 'numeric',
                          })}{' '}
                          · qty {sale.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-emerald-600">
                        ${sale.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStock.length > 0 && (
          <Card className="mt-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <CardTitle className="text-sm text-orange-900">Low Stock — {lowStock.length} items under 20 units</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lowStock.map((item) => (
                  <Badge key={item.id} variant="outline" className="bg-white text-orange-800 border-orange-300">
                    {item.name} ({item.size}) — {item.quantity} left
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
