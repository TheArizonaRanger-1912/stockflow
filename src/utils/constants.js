// Inventory categories
export const CATEGORIES = [
  'Produce',
  'Proteins',
  'Dairy',
  'Dry Goods',
  'Oils & Vinegars',
  'Spices',
  'Beverages',
  'Frozen',
  'Paper Goods',
  'Cleaning',
  'Other'
];

// Unit types
export const UNITS = [
  'lbs',
  'oz',
  'kg',
  'g',
  'bottles',
  'cans',
  'boxes',
  'bags',
  'cases',
  'each',
  'gallons',
  'liters',
  'quarts',
  'pints'
];

// Initial demo data
export const INITIAL_DATA = {
  users: [
    {
      id: 'owner1',
      email: 'owner@restaurant.com',
      password: 'demo123',
      name: 'Alex Thompson',
      role: 'owner'
    }
  ],
  restaurants: [
    {
      id: 'rest1',
      name: 'The Golden Fork',
      ownerId: 'owner1',
      address: '123 Main Street',
      createdAt: new Date().toISOString()
    }
  ],
  inventory: [
    {
      id: 'inv1',
      restaurantId: 'rest1',
      name: 'Tomatoes',
      category: 'Produce',
      quantity: 45,
      unit: 'lbs',
      minStock: 20,
      costPerUnit: 2.5
    },
    {
      id: 'inv2',
      restaurantId: 'rest1',
      name: 'Olive Oil',
      category: 'Oils & Vinegars',
      quantity: 8,
      unit: 'bottles',
      minStock: 5,
      costPerUnit: 12.0
    },
    {
      id: 'inv3',
      restaurantId: 'rest1',
      name: 'Chicken Breast',
      category: 'Proteins',
      quantity: 30,
      unit: 'lbs',
      minStock: 25,
      costPerUnit: 8.5
    },
    {
      id: 'inv4',
      restaurantId: 'rest1',
      name: 'All-Purpose Flour',
      category: 'Dry Goods',
      quantity: 50,
      unit: 'lbs',
      minStock: 30,
      costPerUnit: 0.8
    },
    {
      id: 'inv5',
      restaurantId: 'rest1',
      name: 'Heavy Cream',
      category: 'Dairy',
      quantity: 12,
      unit: 'quarts',
      minStock: 10,
      costPerUnit: 5.0
    }
  ],
  invites: [],
  access: [
    { userId: 'owner1', restaurantId: 'rest1', role: 'owner' }
  ],
  receipts: []
};

// Local storage key
export const STORAGE_KEY = 'stockflow_data';
