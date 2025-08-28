import React from 'react';

const Dashboard = () => {
 
  const inventoryStats = {
    totalItems: 120,
    lowStock: 8,
    expiredItems: 40,
    outOfStock: 15
  };

  return (
    <div className="dashboard">
      <h2>Inventory Dashboard</h2>
      <p className="date">Today, August 16th 2024</p>

 {/* Statistics Cards */}
      <div className="stats-cards">
  <div className="stat-card">
    <div className="stat-icon total">
      📄
    </div>
    <div className="stat-content">
      <h4>Total Items</h4>
      <p>Total items in stock</p>
      <span className="stat-value">{inventoryStats.totalItems}</span>
    </div>
  </div>

  <div className="stat-card">
    <div className="stat-icon low">
      ⏰
    </div>
    <div className="stat-content">
      <h4>Low Stock Items</h4>
      <p>Number of items that are running low</p>
      <span className="stat-value">{inventoryStats.lowStock}</span>
    </div>
  </div>

  <div className="stat-card">
    <div className="stat-icon expired">
      ⚠️
    </div>
    <div className="stat-content">
      <h4>Expired Items</h4>
      <p>Number of items of their expiration date</p>
      <span className="stat-value">{inventoryStats.expiredItems}</span>
    </div>
  </div>

  <div className="stat-card">
    <div className="stat-icon out">
      📦
    </div>
    <div className="stat-content">
      <h4>Out of Stock Items</h4>
      <p>Count of items currently out of stock</p>
      <span className="stat-value">{inventoryStats.outOfStock}</span>
    </div>
  </div>
</div>
    </div>
  );
};

export default Dashboard;
