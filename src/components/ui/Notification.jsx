import React from 'react';
import { Check, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Notification = () => {
  const { notification } = useApp();
  
  if (!notification) return null;
  
  const isError = notification.type === 'error';
  
  return (
    <div
      className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl transform transition-all duration-300 ${
        isError
          ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
          : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        {isError ? <X size={20} /> : <Check size={20} />}
        <span className="font-medium">{notification.message}</span>
      </div>
    </div>
  );
};

export default Notification;
