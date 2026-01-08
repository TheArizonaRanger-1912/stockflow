import React, { useState, useMemo } from 'react';
import { Package, Search, Plus, BarChart3, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../utils/constants';
import {
  filterInventory,
  sortInventory,
  isLowStock,
  calculateTotalValue
} from '../../utils/helpers';
import InventoryItem from './InventoryItem';
import ItemForm from './ItemForm';

const InventoryGrid = () => {
  const {
    selectedRestaurant,
    getRestaurantInventory,
    canManageInventory,
    addInventoryItem,
    updateInventoryItem
  } = useApp();

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Get and process inventory
  const rawInventory = selectedRestaurant
    ? getRestaurantInventory(selectedRestaurant.id)
    : [];

  const inventory = useMemo(() => {
    const filtered = filterInventory(rawInventory, searchTerm, categoryFilter);
    return sortInventory(filtered, sortBy, sortOrder);
  }, [rawInventory, searchTerm, categoryFilter, sortBy, sortOrder]);

  const lowStockCount = rawInventory.filter(isLowStock).length;
  const totalValue = calculateTotalValue(rawInventory);

  // Handlers
  const handleAddItem = (form) => {
    addInventoryItem(form);
    setShowAddItem(false);
  };

  const handleEditItem = (form) => {
    updateInventoryItem(editingItem.id, form);
    setEditingItem(null);
  };

  if (!selectedRestaurant) {
    return null;
  }

  return (
    <div className="p-4 md:p-6 pt-16 md:pt-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs md:text-sm">Total Items</p>
              <p className="text-2xl md:text-3xl font-bold text-white mt-1">
                {rawInventory.length}
              </p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
              <Package size={20} className="text-teal-400 md:w-6 md:h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs md:text-sm">Total Value</p>
              <p className="text-2xl md:text-3xl font-bold text-white mt-1">
                ${totalValue.toFixed(0)}
              </p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <BarChart3 size={20} className="text-emerald-400 md:w-6 md:h-6" />
            </div>
          </div>
        </div>

        <div
          className={`col-span-2 md:col-span-1 bg-gradient-to-br rounded-xl md:rounded-2xl p-4 md:p-6 border ${
            lowStockCount > 0
              ? 'from-red-900/20 to-red-900/10 border-red-500/30'
              : 'from-slate-800 to-slate-800/50 border-slate-700/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-xs md:text-sm ${
                  lowStockCount > 0 ? 'text-red-400' : 'text-slate-500'
                }`}
              >
                Low Stock Alerts
              </p>
              <p
                className={`text-2xl md:text-3xl font-bold mt-1 ${
                  lowStockCount > 0 ? 'text-red-400' : 'text-white'
                }`}
              >
                {lowStockCount}
              </p>
            </div>
            <div
              className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${
                lowStockCount > 0 ? 'bg-red-500/20' : 'bg-slate-700/50'
              }`}
            >
              <AlertTriangle
                size={20}
                className={`md:w-6 md:h-6 ${lowStockCount > 0 ? 'text-red-400' : 'text-slate-500'}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col gap-3 md:gap-4 mb-6">
        <div className="flex-1 relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search inventory..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm md:text-base"
          />
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 min-w-[140px] px-3 md:px-4 py-2 md:py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSort, newOrder] = e.target.value.split('-');
              setSortBy(newSort);
              setSortOrder(newOrder);
            }}
            className="flex-1 min-w-[140px] px-3 md:px-4 py-2 md:py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="quantity-asc">Qty (Low-High)</option>
            <option value="quantity-desc">Qty (High-Low)</option>
            <option value="category-asc">Category</option>
            <option value="value-desc">Value (High-Low)</option>
          </select>

          {canManageInventory() && (
            <button
              onClick={() => setShowAddItem(true)}
              className="flex items-center justify-center gap-2 px-4 md:px-5 py-2 md:py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25 text-sm md:text-base"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Item</span>
            </button>
          )}
        </div>
      </div>

      {/* Inventory Grid */}
      {inventory.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-slate-700/50">
          <Package size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No items found
          </h3>
          <p className="text-slate-500 max-w-md mx-auto">
            {searchTerm || categoryFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start adding items to your inventory'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inventory.map((item) => (
            <InventoryItem
              key={item.id}
              item={item}
              onEdit={setEditingItem}
            />
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItem && (
        <ItemForm
          onSubmit={handleAddItem}
          onCancel={() => setShowAddItem(false)}
        />
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <ItemForm
          item={editingItem}
          onSubmit={handleEditItem}
          onCancel={() => setEditingItem(null)}
        />
      )}
    </div>
  );
};

export default InventoryGrid;
