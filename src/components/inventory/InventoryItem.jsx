import React from 'react';
import { Edit3, Trash2, Plus, Minus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { isLowStock, calculateItemValue } from '../../utils/helpers';

const InventoryItem = ({ item, onEdit }) => {
  const {
    canManageInventory,
    deleteInventoryItem,
    updateItemQuantity,
    setItemQuantity
  } = useApp();

  const lowStock = isLowStock(item);
  const value = calculateItemValue(item);

  return (
    <div
      className={`bg-slate-800/50 rounded-2xl p-5 border transition-all hover:border-slate-600 ${
        lowStock
          ? 'border-red-500/50 bg-red-900/10'
          : 'border-slate-700/50'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{item.name}</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">
            {item.category}
          </span>
        </div>
        {canManageInventory() && (
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(item)}
              className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => deleteInventoryItem(item.id)}
              className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Quantity controls */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-3xl font-bold text-white">{item.quantity}</p>
          <p className="text-sm text-slate-500">{item.unit}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => updateItemQuantity(item.id, -1)}
            className="w-10 h-10 rounded-xl bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-colors"
          >
            <Minus size={18} />
          </button>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => setItemQuantity(item.id, e.target.value)}
            className="w-16 h-10 text-center bg-slate-700 border-0 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            onClick={() => updateItemQuantity(item.id, 1)}
            className="w-10 h-10 rounded-xl bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
        <div className="text-sm">
          <span className="text-slate-500">Min stock: </span>
          <span
            className={
              lowStock ? 'text-red-400 font-medium' : 'text-slate-300'
            }
          >
            {item.minStock} {item.unit}
          </span>
        </div>
        <div className="text-sm">
          <span className="text-slate-500">Value: </span>
          <span className="text-emerald-400 font-medium">
            ${value.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InventoryItem;
