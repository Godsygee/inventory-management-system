import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { addSale, getInventory } from '../utils/storage';
import { Sale } from '../types';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface AddSaleDialogProps {
  onSaleAdded: () => void;
}

export function AddSaleDialog({ onSaleAdded }: AddSaleDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  
  const inventory = getInventory();
  const selectedItem = inventory.find(item => item.id === selectedItemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedItem) {
      toast.error('Please select an item');
      return;
    }

    const qty = parseInt(quantity);
    
    if (qty > selectedItem.quantity) {
      toast.error(`Only ${selectedItem.quantity} units available in stock`);
      return;
    }

    const newSale: Sale = {
      id: Date.now().toString(),
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      quantity: qty,
      pricePerUnit: selectedItem.sellingPrice,
      totalAmount: qty * selectedItem.sellingPrice,
      date: new Date().toISOString(),
      timestamp: Date.now(),
    };

    addSale(newSale);
    toast.success(`Sale recorded: ${qty} × ${selectedItem.name}`);
    onSaleAdded();
    setOpen(false);
    
    // Reset form
    setSelectedItemId('');
    setQuantity('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Record Sale
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record New Sale</DialogTitle>
          <DialogDescription>
            Select an item and enter the quantity sold.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="item">Select Item *</Label>
              <Select
                value={selectedItemId}
                onValueChange={setSelectedItemId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an item" />
                </SelectTrigger>
                <SelectContent>
                  {inventory
                    .filter(item => item.quantity > 0)
                    .map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} - {item.size} ({item.color}) - Stock: {item.quantity}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {selectedItem && (
              <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available Stock:</span>
                  <span className="font-medium">{selectedItem.quantity} units</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price per Unit:</span>
                  <span className="font-medium">${selectedItem.sellingPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={selectedItem?.quantity || 999}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                required
              />
            </div>

            {selectedItem && quantity && parseInt(quantity) > 0 && (
              <div className="bg-indigo-50 p-3 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-lg font-bold text-indigo-600">
                    ${(parseInt(quantity) * selectedItem.sellingPrice).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Record Sale</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
