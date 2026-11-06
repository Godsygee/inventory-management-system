import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { getSales } from '../utils/storage';
import { Sale } from '../types';
import Layout from '../components/Layout';
import { AddSaleDialog } from '../components/add-sale-dialog';
import { ShoppingBag } from 'lucide-react';

export default function SalesHistory() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setSales(getSales());
  }, [refreshKey]);

  const sorted = [...sales].sort((a, b) => b.timestamp - a.timestamp);
  const totalRevenue = sales.reduce((s, sale) => s + sale.totalAmount, 0);

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Sales History</h1>
            <p className="text-sm text-gray-500 mt-1">{sales.length} transactions · ${totalRevenue.toFixed(2)} total revenue</p>
          </div>
          <AddSaleDialog onSaleAdded={() => setRefreshKey((k) => k + 1)} />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-indigo-500" />
              <CardTitle className="text-base">All Transactions</CardTitle>
            </div>
            <CardDescription>Complete sales log, newest first</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price / Unit</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-400 py-10">
                        No sales recorded yet.
                      </TableCell>
                    </TableRow>
                  )}
                  {sorted.map((sale) => {
                    const d = new Date(sale.date);
                    return (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium text-indigo-700">
                          {d.toLocaleDateString('en-US', { weekday: 'long' })}
                        </TableCell>
                        <TableCell>
                          {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                        <TableCell className="font-medium">{sale.itemName}</TableCell>
                        <TableCell>{sale.quantity}</TableCell>
                        <TableCell>${sale.pricePerUnit.toFixed(2)}</TableCell>
                        <TableCell className="font-semibold text-emerald-600">
                          ${sale.totalAmount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
