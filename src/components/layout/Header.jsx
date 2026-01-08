import React from 'react';
import { Users, Trash2, Pencil, Receipt } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getRoleBadgeStyles } from '../../utils/helpers';

const Header = ({ onManageAccess, onEditRestaurant, onReceipts }) => {
  const {
    selectedRestaurant,
    getUserRole,
    canManageInventory,
    canDeleteRestaurant,
    deleteRestaurant
  } = useApp();

  if (!selectedRestaurant) return null;

  const role = getUserRole(selectedRestaurant.id);

  const handleDelete = () => {
    if (
      confirm(
        'Are you sure you want to delete this restaurant? This will remove all inventory and access.'
      )
    ) {
      deleteRestaurant(selectedRestaurant.id);
    }
  };

  return (
    <div className="sticky top-0 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 p-4 md:p-6 z-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="pl-12 md:pl-0">
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <h1 className="text-lg md:text-2xl font-bold text-white">
              {selectedRestaurant.name}
            </h1>
            <span
              className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeStyles(
                role
              )}`}
            >
              {role}
            </span>
          </div>
          <p className="text-slate-500 text-sm md:text-base mt-1">{selectedRestaurant.address}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onReceipts}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-sm md:text-base"
          >
            <Receipt size={18} />
            <span className="hidden sm:inline">Receipts</span>
          </button>
          {canDeleteRestaurant() && (
            <button
              onClick={onEditRestaurant}
              className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-sm md:text-base"
            >
              <Pencil size={18} />
              <span className="hidden sm:inline">Edit</span>
            </button>
          )}
          {canManageInventory() && (
            <button
              onClick={onManageAccess}
              className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-sm md:text-base"
            >
              <Users size={18} />
              <span className="hidden sm:inline">Team</span>
            </button>
          )}
          {canDeleteRestaurant() && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors text-sm md:text-base"
            >
              <Trash2 size={18} />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
