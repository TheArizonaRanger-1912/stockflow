import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const EditRestaurantModal = ({ restaurant, onClose }) => {
  const { updateRestaurant } = useApp();

  const [form, setForm] = useState({
    name: restaurant?.name || '',
    address: restaurant?.address || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateRestaurant(restaurant.id, {
      name: form.name,
      address: form.address
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-3xl p-8 w-full max-w-md border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6">Edit Restaurant</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Restaurant Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Restaurant name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="123 Main Street, City"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:from-amber-400 hover:to-orange-400 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRestaurantModal;
