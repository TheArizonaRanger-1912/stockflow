import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_DATA, STORAGE_KEY } from '../utils/constants';
import { generateId, generateInviteCode } from '../utils/helpers';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Core data state (persisted)
  const [data, setData] = useLocalStorage(STORAGE_KEY, INITIAL_DATA);

  // UI state (not persisted)
  const [currentUser, setCurrentUser] = useState(() => {
    // Restore user session from localStorage on mount
    const savedUser = localStorage.getItem('stockflow_currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [notification, setNotification] = useState(null);

  // Persist currentUser to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('stockflow_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('stockflow_currentUser');
    }
  }, [currentUser]);

  // Show notification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ============ AUTH FUNCTIONS ============
  
  const login = (email, password) => {
    const user = data.users.find(
      u => u.email === email && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const register = (name, email, password) => {
    if (data.users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }
    
    const newUser = {
      id: generateId(),
      name,
      email,
      password,
      role: 'owner'
    };
    
    setData(prev => ({
      ...prev,
      users: [...prev.users, newUser]
    }));
    
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setSelectedRestaurant(null);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...currentUser, ...updates };

    // Update in users array
    setData(prev => ({
      ...prev,
      users: prev.users.map(u =>
        u.id === currentUser.id ? updatedUser : u
      )
    }));

    // Update current user state
    setCurrentUser(updatedUser);
    showNotification('Profile updated!');
  };

  const updateRestaurant = (restaurantId, updates) => {
    setData(prev => ({
      ...prev,
      restaurants: prev.restaurants.map(r =>
        r.id === restaurantId ? { ...r, ...updates } : r
      )
    }));

    // Update selected restaurant if it's the one being edited
    if (selectedRestaurant?.id === restaurantId) {
      setSelectedRestaurant(prev => ({ ...prev, ...updates }));
    }

    showNotification('Restaurant updated!');
  };

  // ============ RESTAURANT FUNCTIONS ============
  
  const addRestaurant = (name, address) => {
    const newRestaurant = {
      id: generateId(),
      name,
      address,
      ownerId: currentUser.id,
      createdAt: new Date().toISOString()
    };
    
    const newAccess = {
      userId: currentUser.id,
      restaurantId: newRestaurant.id,
      role: 'owner'
    };
    
    setData(prev => ({
      ...prev,
      restaurants: [...prev.restaurants, newRestaurant],
      access: [...prev.access, newAccess]
    }));
    
    showNotification('Restaurant added successfully!');
    return newRestaurant;
  };

  const deleteRestaurant = (restaurantId) => {
    setData(prev => ({
      ...prev,
      restaurants: prev.restaurants.filter(r => r.id !== restaurantId),
      inventory: prev.inventory.filter(i => i.restaurantId !== restaurantId),
      access: prev.access.filter(a => a.restaurantId !== restaurantId),
      invites: prev.invites.filter(i => !i.restaurants.includes(restaurantId))
    }));
    
    if (selectedRestaurant?.id === restaurantId) {
      setSelectedRestaurant(null);
    }
    
    showNotification('Restaurant deleted');
  };

  const getUserRestaurants = () => {
    if (!currentUser) return [];
    const accessibleIds = data.access
      .filter(a => a.userId === currentUser.id)
      .map(a => a.restaurantId);
    return data.restaurants.filter(r => accessibleIds.includes(r.id));
  };

  const getUserRole = (restaurantId) => {
    if (!currentUser) return null;
    const access = data.access.find(
      a => a.userId === currentUser.id && a.restaurantId === restaurantId
    );
    return access?.role || null;
  };

  // ============ INVENTORY FUNCTIONS ============
  
  const addInventoryItem = (item) => {
    const newItem = {
      id: generateId(),
      restaurantId: selectedRestaurant.id,
      ...item,
      quantity: Number(item.quantity),
      minStock: Number(item.minStock),
      costPerUnit: Number(item.costPerUnit)
    };
    
    setData(prev => ({
      ...prev,
      inventory: [...prev.inventory, newItem]
    }));
    
    showNotification('Item added to inventory!');
    return newItem;
  };

  const updateInventoryItem = (itemId, updates) => {
    setData(prev => ({
      ...prev,
      inventory: prev.inventory.map(item =>
        item.id === itemId
          ? {
              ...item,
              ...updates,
              quantity: Number(updates.quantity ?? item.quantity),
              minStock: Number(updates.minStock ?? item.minStock),
              costPerUnit: Number(updates.costPerUnit ?? item.costPerUnit)
            }
          : item
      )
    }));
    
    showNotification('Item updated!');
  };

  const deleteInventoryItem = (itemId) => {
    setData(prev => ({
      ...prev,
      inventory: prev.inventory.filter(i => i.id !== itemId)
    }));
    
    showNotification('Item removed');
  };

  const updateItemQuantity = (itemId, delta) => {
    setData(prev => ({
      ...prev,
      inventory: prev.inventory.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
    }));
  };

  const setItemQuantity = (itemId, newQuantity) => {
    setData(prev => ({
      ...prev,
      inventory: prev.inventory.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, Number(newQuantity)) }
          : item
      )
    }));
  };

  const getRestaurantInventory = (restaurantId) => {
    return data.inventory.filter(i => i.restaurantId === restaurantId);
  };

  // ============ INVITE FUNCTIONS ============
  
  const createInvite = (role, restaurantIds) => {
    const code = generateInviteCode();
    const invite = {
      id: generateId(),
      code,
      role,
      restaurants: restaurantIds,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      used: false
    };
    
    setData(prev => ({
      ...prev,
      invites: [...prev.invites, invite]
    }));
    
    const link = `${window.location.origin}${window.location.pathname}?invite=${code}`;
    showNotification('Invite link created!');
    return link;
  };

  const acceptInvite = (code) => {
    const invite = data.invites.find(i => i.code === code && !i.used);
    if (!invite) {
      return { success: false, error: 'Invalid or expired invite link' };
    }
    
    // Store for processing after login
    sessionStorage.setItem('pendingInvite', code);
    return { success: true, invite };
  };

  const processPendingInvite = () => {
    if (!currentUser) return;
    
    const pendingInviteCode = sessionStorage.getItem('pendingInvite');
    if (!pendingInviteCode) return;
    
    const invite = data.invites.find(
      i => i.code === pendingInviteCode && !i.used
    );
    if (!invite) return;
    
    // Grant access to all restaurants in the invite
    const newAccess = invite.restaurants.map(restaurantId => ({
      userId: currentUser.id,
      restaurantId,
      role: invite.role
    }));
    
    setData(prev => ({
      ...prev,
      access: [
        ...prev.access.filter(
          a => !newAccess.some(
            na => na.userId === a.userId && na.restaurantId === a.restaurantId
          )
        ),
        ...newAccess
      ],
      invites: prev.invites.map(i =>
        i.code === pendingInviteCode
          ? { ...i, used: true, usedBy: currentUser.id }
          : i
      )
    }));
    
    sessionStorage.removeItem('pendingInvite');
    showNotification(
      `You now have ${invite.role} access to ${invite.restaurants.length} restaurant(s)!`
    );
  };

  // Process pending invite when user logs in
  useEffect(() => {
    processPendingInvite();
  }, [currentUser]);

  // ============ ACCESS MANAGEMENT ============
  
  const getRestaurantUsers = (restaurantId) => {
    const accessList = data.access.filter(a => a.restaurantId === restaurantId);
    return accessList
      .map(a => ({
        ...data.users.find(u => u.id === a.userId),
        accessRole: a.role
      }))
      .filter(u => u.id);
  };

  const removeAccess = (userId, restaurantId) => {
    setData(prev => ({
      ...prev,
      access: prev.access.filter(
        a => !(a.userId === userId && a.restaurantId === restaurantId)
      )
    }));
    
    showNotification('Access removed');
  };

  // ============ RECEIPT FUNCTIONS ============

  const addReceipt = (restaurantId, imageData, note = '') => {
    const receipt = {
      id: generateId(),
      restaurantId,
      imageData, // base64 encoded image
      note,
      uploadedBy: currentUser.id,
      uploadedAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    setData(prev => ({
      ...prev,
      receipts: [...(prev.receipts || []), receipt]
    }));

    showNotification('Receipt uploaded!');
    return receipt;
  };

  const deleteReceipt = (receiptId) => {
    setData(prev => ({
      ...prev,
      receipts: (prev.receipts || []).filter(r => r.id !== receiptId)
    }));

    showNotification('Receipt deleted');
  };

  const getRestaurantReceipts = (restaurantId) => {
    return (data.receipts || [])
      .filter(r => r.restaurantId === restaurantId)
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  };

  // ============ PERMISSION HELPERS ============
  
  const canManageInventory = () => {
    const role = getUserRole(selectedRestaurant?.id);
    return role === 'owner' || role === 'manager';
  };

  const canDeleteRestaurant = () => {
    return getUserRole(selectedRestaurant?.id) === 'owner';
  };

  const isOwner = () => {
    return data.restaurants.some(r => r.ownerId === currentUser?.id);
  };

  const value = {
    // State
    data,
    currentUser,
    selectedRestaurant,
    notification,
    
    // Setters
    setSelectedRestaurant,
    
    // Auth
    login,
    register,
    logout,
    updateUser,
    
    // Restaurants
    addRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getUserRestaurants,
    getUserRole,
    
    // Inventory
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    updateItemQuantity,
    setItemQuantity,
    getRestaurantInventory,
    
    // Invites
    createInvite,
    acceptInvite,
    
    // Access
    getRestaurantUsers,
    removeAccess,

    // Receipts
    addReceipt,
    deleteReceipt,
    getRestaurantReceipts,

    // Permissions
    canManageInventory,
    canDeleteRestaurant,
    isOwner,
    
    // Notifications
    showNotification
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
