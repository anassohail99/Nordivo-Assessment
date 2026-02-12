import { useState, useEffect } from 'react';
import { AddOn, SelectedAddOn } from '../types';
import addOnService from '../services/addon.service';
import { ShoppingCart } from 'lucide-react';

interface AddOnsSelectionProps {
  selectedAddOns: SelectedAddOn[];
  onAddOnsChange: (addOns: SelectedAddOn[]) => void;
}

const AddOnsSelection = ({ selectedAddOns, onAddOnsChange }: AddOnsSelectionProps) => {
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadAddOns();
  }, []);

  const loadAddOns = async () => {
    try {
      setLoading(true);
      const data = await addOnService.getAllAddOns();
      setAddOns(data);
    } catch (error) {
      console.error('Failed to load add-ons:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'food', label: 'Food' },
    { value: 'beverage', label: 'Beverages' },
    { value: 'accessory', label: 'Accessories' },
    { value: 'upgrade', label: 'Upgrades' }
  ];

  const filteredAddOns = selectedCategory === 'all'
    ? addOns
    : addOns.filter(a => a.category === selectedCategory);

  const getQuantity = (addOnId: string): number => {
    const item = selectedAddOns.find(a => a.addOnId === addOnId);
    return item ? item.quantity : 0;
  };

  const handleQuantityChange = (addOn: AddOn, newQty: number) => {
    const quantity = Math.max(0, Math.min(99, newQty));

    if (quantity === 0) {
      onAddOnsChange(selectedAddOns.filter(a => a.addOnId !== addOn._id));
    } else {
      const existing = selectedAddOns.find(a => a.addOnId === addOn._id);
      if (existing) {
        onAddOnsChange(
          selectedAddOns.map(a =>
            a.addOnId === addOn._id ? { ...a, quantity } : a
          )
        );
      } else {
        onAddOnsChange([
          ...selectedAddOns,
          {
            addOnId: addOn._id,
            name: addOn.name,
            price: addOn.price,
            quantity
          }
        ]);
      }
    }
  };

  const totalAddOnsAmount = selectedAddOns.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading add-ons...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Enhance Your Experience</h3>
        {totalAddOnsAmount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <ShoppingCart className="w-4 h-4 text-amber-500" />
            <span className="text-amber-500 font-semibold">
              ${totalAddOnsAmount.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === cat.value
                ? 'bg-amber-500 text-white'
                : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAddOns.map(addOn => {
          const quantity = getQuantity(addOn._id);
          return (
            <div
              key={addOn._id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-amber-500/50 transition-colors"
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={addOn.image}
                    alt={addOn.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white truncate">{addOn.name}</h4>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {addOn.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-amber-500 font-semibold">
                      ${addOn.price.toFixed(2)}
                    </span>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(addOn, parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="w-16 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-center text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAddOns.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No add-ons available in this category
        </div>
      )}
    </div>
  );
};

export default AddOnsSelection;
