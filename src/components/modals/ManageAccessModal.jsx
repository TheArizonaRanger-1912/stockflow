import React from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getRoleBadgeStyles } from '../../utils/helpers';

const ManageAccessModal = ({ onClose }) => {
  const {
    selectedRestaurant,
    getRestaurantUsers,
    removeAccess,
    canDeleteRestaurant
  } = useApp();

  if (!selectedRestaurant) return null;

  const users = getRestaurantUsers(selectedRestaurant.id);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-3xl p-8 w-full max-w-lg border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6">Team Access</h2>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeStyles(
                    user.accessRole
                  )}`}
                >
                  {user.accessRole}
                </span>
                {user.accessRole !== 'owner' && canDeleteRestaurant() && (
                  <button
                    onClick={() =>
                      removeAccess(user.id, selectedRestaurant.id)
                    }
                    className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            No team members yet
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ManageAccessModal;
