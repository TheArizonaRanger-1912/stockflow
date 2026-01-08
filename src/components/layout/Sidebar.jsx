import React from 'react';
import {
  Package,
  Plus,
  Building2,
  LogOut,
  Send,
  ChevronRight,
  Pencil
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getRoleBadgeStyles } from '../../utils/helpers';

const Sidebar = ({ isOpen, onToggle, onAddRestaurant, onInvite, onEditProfile }) => {
  const {
    currentUser,
    selectedRestaurant,
    setSelectedRestaurant,
    getUserRestaurants,
    getUserRole,
    isOwner,
    logout
  } = useApp();

  const restaurants = getUserRestaurants();

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-700/50 transition-all duration-300 z-40 ${
        isOpen ? 'w-72' : 'w-20'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Package size={24} className="text-white" />
            </div>
            {isOpen && (
              <div>
                <h1
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  StockFlow
                </h1>
                <p className="text-xs text-slate-500">Inventory Manager</p>
              </div>
            )}
          </div>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-semibold">
              {currentUser?.name?.charAt(0)}
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {currentUser?.email}
                </p>
              </div>
            )}
            {isOpen && (
              <button
                onClick={onEditProfile}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Edit Profile"
              >
                <Pencil size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Restaurants list */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4">
            {isOpen && (
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Restaurants
              </h3>
            )}
            {isOwner() && (
              <button
                onClick={onAddRestaurant}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <Plus size={16} />
              </button>
            )}
          </div>

          <div className="space-y-2">
            {restaurants.map((restaurant) => {
              const role = getUserRole(restaurant.id);
              return (
                <button
                  key={restaurant.id}
                  onClick={() => setSelectedRestaurant(restaurant)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    selectedRestaurant?.id === restaurant.id
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-white'
                      : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 size={20} />
                  {isOpen && (
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium truncate">
                        {restaurant.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{role}</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {restaurants.length === 0 && isOpen && (
            <div className="text-center py-8">
              <Building2 size={32} className="mx-auto text-slate-600 mb-3" />
              <p className="text-sm text-slate-500">No restaurants yet</p>
              {isOwner() && (
                <button
                  onClick={onAddRestaurant}
                  className="mt-3 text-sm text-amber-400 hover:text-amber-300"
                >
                  Add your first restaurant
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className="p-4 border-t border-slate-700/50 space-y-2">
          {isOwner() && (
            <button
              onClick={onInvite}
              className={`w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ${
                !isOpen && 'justify-center'
              }`}
            >
              <Send size={20} />
              {isOpen && <span className="text-sm">Invite Team</span>}
            </button>
          )}
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors ${
              !isOpen && 'justify-center'
            }`}
          >
            <LogOut size={20} />
            {isOpen && <span className="text-sm">Sign Out</span>}
          </button>
        </div>

        {/* Toggle button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-slate-800 border border-slate-700 rounded-r-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <ChevronRight
            size={16}
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
