import React, { useState, useEffect } from 'react';
import { Building2, Menu } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import Notification from './components/ui/Notification';
import AuthPage from './components/auth/AuthPage';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import InventoryGrid from './components/inventory/InventoryGrid';
import AddRestaurantModal from './components/modals/AddRestaurantModal';
import InviteModal from './components/modals/InviteModal';
import ManageAccessModal from './components/modals/ManageAccessModal';
import EditProfileModal from './components/modals/EditProfileModal';
import EditRestaurantModal from './components/modals/EditRestaurantModal';
import ReceiptsModal from './components/modals/ReceiptsModal';

const Dashboard = () => {
  const { currentUser, selectedRestaurant, acceptInvite } = useApp();
  
  // UI State - start with sidebar closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showManageAccess, setShowManageAccess] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditRestaurant, setShowEditRestaurant] = useState(false);
  const [showReceipts, setShowReceipts] = useState(false);

  // Check for invite code in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteCode = urlParams.get('invite');
    if (inviteCode) {
      acceptInvite(inviteCode);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Not logged in - show auth page
  if (!currentUser) {
    return <AuthPage />;
  }

  // Logged in - show dashboard
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Notification />
      
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onAddRestaurant={() => setShowAddRestaurant(true)}
        onInvite={() => setShowInvite(true)}
        onEditProfile={() => setShowEditProfile(true)}
      />
      
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'md:ml-72' : 'md:ml-20'
        }`}
      >
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-30 p-2 bg-slate-800 rounded-xl text-white shadow-lg"
        >
          <Menu size={24} />
        </button>

        {selectedRestaurant ? (
          <>
            <Header
              onManageAccess={() => setShowManageAccess(true)}
              onEditRestaurant={() => setShowEditRestaurant(true)}
              onReceipts={() => setShowReceipts(true)}
            />
            <InventoryGrid />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="w-24 h-24 rounded-3xl bg-slate-800 flex items-center justify-center mx-auto mb-6">
                <Building2 size={48} className="text-slate-600" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Select a Restaurant
              </h2>
              <p className="text-slate-500 max-w-md">
                Choose a restaurant from the sidebar to view and manage its
                inventory.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddRestaurant && (
        <AddRestaurantModal onClose={() => setShowAddRestaurant(false)} />
      )}
      
      {showInvite && (
        <InviteModal onClose={() => setShowInvite(false)} />
      )}
      
      {showManageAccess && (
        <ManageAccessModal onClose={() => setShowManageAccess(false)} />
      )}

      {showEditProfile && (
        <EditProfileModal onClose={() => setShowEditProfile(false)} />
      )}

      {showEditRestaurant && selectedRestaurant && (
        <EditRestaurantModal
          restaurant={selectedRestaurant}
          onClose={() => setShowEditRestaurant(false)}
        />
      )}

      {showReceipts && selectedRestaurant && (
        <ReceiptsModal onClose={() => setShowReceipts(false)} />
      )}
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
};

export default App;
