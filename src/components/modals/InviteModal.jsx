import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const InviteModal = ({ onClose }) => {
  const { data, currentUser, createInvite, showNotification } = useApp();
  
  const [form, setForm] = useState({
    role: 'employee',
    restaurants: []
  });
  const [inviteLink, setInviteLink] = useState(null);

  // Get restaurants owned by current user
  const ownedRestaurants = data.restaurants.filter(
    r => r.ownerId === currentUser.id
  );

  const handleCreateInvite = () => {
    if (form.restaurants.length === 0) {
      showNotification('Please select at least one restaurant', 'error');
      return;
    }
    
    const link = createInvite(form.role, form.restaurants);
    setInviteLink(link);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    showNotification('Link copied to clipboard!');
  };

  const handleClose = () => {
    setForm({ role: 'employee', restaurants: [] });
    setInviteLink(null);
    onClose();
  };

  const toggleRestaurant = (restaurantId) => {
    if (form.restaurants.includes(restaurantId)) {
      setForm({
        ...form,
        restaurants: form.restaurants.filter(id => id !== restaurantId)
      });
    } else {
      setForm({
        ...form,
        restaurants: [...form.restaurants, restaurantId]
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-3xl p-8 w-full max-w-lg border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6">
          Invite Team Member
        </h2>

        {!inviteLink ? (
          <div className="space-y-5">
            {/* Role selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="manager">Manager (Full inventory access)</option>
                <option value="employee">Employee (Update counts only)</option>
              </select>
              <p className="text-xs text-slate-500 mt-2">
                {form.role === 'manager'
                  ? 'Managers can add, edit, and delete inventory items'
                  : 'Employees can only update item quantities'}
              </p>
            </div>

            {/* Restaurant selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Restaurants
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {ownedRestaurants.map((restaurant) => (
                  <label
                    key={restaurant.id}
                    className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-700 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={form.restaurants.includes(restaurant.id)}
                      onChange={() => toggleRestaurant(restaurant.id)}
                      className="w-5 h-5 rounded bg-slate-600 border-slate-500 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-white">{restaurant.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateInvite}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:from-amber-400 hover:to-orange-400 transition-all"
              >
                Generate Link
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="p-4 bg-slate-700/50 rounded-xl">
              <p className="text-sm text-slate-400 mb-2">
                Share this link with your team member:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-3 bg-slate-600 hover:bg-slate-500 rounded-xl text-white transition-colors"
                >
                  <Copy size={20} />
                </button>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteModal;
