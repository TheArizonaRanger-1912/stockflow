# StockFlow - Restaurant Inventory Management

A modern, role-based inventory management system for restaurants.

## Features

- **Multi-restaurant support** - Manage inventory across multiple locations
- **Role-based access control**
  - **Owner/GM**: Full access - create restaurants, manage inventory, invite team, delete restaurants
  - **Manager**: Can add/edit/delete inventory items, but cannot delete restaurants
  - **Employee**: Can only update item quantities (count updates)
- **Invite system** - Generate shareable links to invite team members
- **Low stock alerts** - Visual warnings when items fall below minimum stock
- **Search & filter** - Find items quickly by name or category
- **Inventory valuation** - Track the total value of your inventory

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)

### Installation

1. Open a terminal and navigate to the project folder:
   ```bash
   cd stockflow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to the URL shown (usually http://localhost:5173)

### Demo Account

To try out the app immediately, use these credentials:
- **Email**: owner@restaurant.com
- **Password**: demo123

## Project Structure

```
stockflow/
├── src/
│   ├── components/
│   │   ├── auth/           # Login/Register pages
│   │   ├── inventory/      # Inventory grid and item components
│   │   ├── layout/         # Sidebar, Header
│   │   ├── modals/         # Add restaurant, Invite, Manage access
│   │   └── ui/             # Reusable UI components (Notification)
│   ├── context/
│   │   └── AppContext.jsx  # Global state management
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── utils/
│   │   ├── constants.js    # Categories, units, initial data
│   │   └── helpers.js      # Utility functions
│   ├── App.jsx             # Main app component
│   ├── index.jsx           # Entry point
│   └── index.css           # Global styles + Tailwind
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## How It Works

### Authentication
- Create a new owner account or log in with existing credentials
- Data is stored in browser localStorage (persists between sessions)

### Managing Restaurants
- Owners can create new restaurants from the sidebar
- Select a restaurant to view/manage its inventory
- Only owners can delete restaurants

### Inventory Management
- **Owners & Managers**: Add, edit, and delete inventory items
- **Employees**: Can only adjust item quantities using +/- buttons
- Items show low stock warnings when quantity falls below minimum

### Inviting Team Members
1. Click "Invite Team" in the sidebar
2. Select a role (Manager or Employee)
3. Choose which restaurants to grant access to
4. Share the generated link with your team member
5. They create an account (or log in) and automatically get access

## Building for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized static files ready for deployment.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **localStorage** - Data persistence

## License

MIT
