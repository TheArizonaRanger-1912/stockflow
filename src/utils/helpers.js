/**
 * Generate a random ID string
 */
export const generateId = () => Math.random().toString(36).substr(2, 9);

/**
 * Generate an invite code
 */
export const generateInviteCode = () => 
  Math.random().toString(36).substr(2, 12).toUpperCase();

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

/**
 * Get role badge styles
 */
export const getRoleBadgeStyles = (role) => {
  switch (role) {
    case 'owner':
      return 'bg-amber-500/20 text-amber-400';
    case 'manager':
      return 'bg-teal-500/20 text-teal-400';
    case 'employee':
    default:
      return 'bg-slate-500/20 text-slate-400';
  }
};

/**
 * Check if item is low on stock
 */
export const isLowStock = (item) => item.quantity <= item.minStock;

/**
 * Calculate item value
 */
export const calculateItemValue = (item) => item.quantity * item.costPerUnit;

/**
 * Calculate total inventory value
 */
export const calculateTotalValue = (items) => 
  items.reduce((sum, item) => sum + calculateItemValue(item), 0);

/**
 * Sort inventory items
 */
export const sortInventory = (items, sortBy, sortOrder) => {
  return [...items].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'quantity':
        comparison = a.quantity - b.quantity;
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'value':
        comparison = calculateItemValue(a) - calculateItemValue(b);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
};

/**
 * Filter inventory items
 */
export const filterInventory = (items, searchTerm, categoryFilter) => {
  return items.filter(item => {
    const matchesSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || 
      item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
};
