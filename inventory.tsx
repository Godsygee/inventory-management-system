import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { getInventory, deleteInventoryItem } from '../utils/storage';
import { InventoryItem } from '../types';
import Layout from '../components/Layout';
import { AddItemDialog } from '../components/add-item-dialog';
import { Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setInventory(getInventory());
  }, [refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}" from inventory?`)) {
      deleteInventoryItem(id);
      toast.success('Item deleted');
      refresh();
    }
  };

  const totalUnits = inventory.reduce((s, i) => s + i.quantity, 0);
  const totalValue = inventory.reduce((s, i) => s + i.costPrice * i.quantity, 0);
  const lowCount = inventory.filter((i) => i.quantity < 20).length;

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
            <p className="text-sm text-gray-500 mt-1">{inventory.length} products · {totalUnits.toLocaleString()} total units</p>
          </div>
          <AddItemDialog onItemAdded={refresh} />
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Products</p>
            <p className="text-xl font-bold">{inventory.length}</p>
          </div>
          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Stock Value (cost)</p>
            <p className="text-xl font-bold">${totalValue.toFixed(2)}</p>
          </div>
          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Low Stock Items</p>
            <p className={`text-xl font-bold ${lowCount > 0 ? 'text-orange-500' : 'text-gray-900'}`}>{lowCount}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-500" />
              <CardTitle className="text-base">All Items</CardTitle>
            </div>
            <CardDescription>Full inventory with cost and selling prices</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Sell Price</TableHead>
                    <TableHead>Margin</TableHead>
                    <TableHead>Stock Value</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center text-gray-400 py-10">
                        No inventory items yet. Add one above.
                      </TableCell>
                    </TableRow>
                  )}
                  {inventory.map((item) => {
                    const margin = item.sellingPrice > 0
                      ? (((item.sellingPrice - item.costPrice) / item.sellingPrice) * 100).toFixed(0)
                      : '0';
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-xs text-gray-500">{item.sku}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell>{item.color}</TableCell>
                        <TableCell>
                          <Badge variant={item.quantity < 20 ? 'destructive' : 'default'}>
                            {item.quantity}
                          </Badge>
                        </TableCell>
                        <TableCell>${item.costPrice.toFixed(2)}</TableCell>
                        <TableCell>${item.sellingPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-emerald-600">{margin}%</TableCell>
                        <TableCell className="font-medium">${(item.costPrice * item.quantity).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id, item.name)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
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
