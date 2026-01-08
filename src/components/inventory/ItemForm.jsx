import React, { useState, useEffect } from 'react';
import { CATEGORIES, UNITS } from '../../utils/constants';

const ItemForm = ({ item, onSubmit, onCancel }) => {
  const isEditing = !!item;
  
  const [form, setForm] = useState({
    name: '',
    category: 'Produce',
    quantity: 0,
    unit: 'lbs',
    minStock: 0,
    costPerUnit: 0
  });

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        minStock: item.minStock,
        costPerUnit: item.costPerUnit
      });
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-3xl p-8 w-full max-w-lg border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6">
          {isEditing ? 'Edit Item' : 'Add Inventory Item'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {/* Item Name */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Item Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Tomatoes"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Unit */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Unit
              </label>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Quantity */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Current Quantity
              </label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                min="0"
                required
              />
            </div>

            {/* Minimum Stock */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Minimum Stock
              </label>
              <input
                type="number"
                value={form.minStock}
                onChange={(e) => setForm({ ...form, minStock: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                min="0"
                required
              />
            </div>

            {/* Cost per Unit */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Cost per Unit ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.costPerUnit}
                onChange={(e) =>
                  setForm({ ...form, costPerUnit: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                min="0"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:from-amber-400 hover:to-orange-400 transition-all"
            >
              {isEditing ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
