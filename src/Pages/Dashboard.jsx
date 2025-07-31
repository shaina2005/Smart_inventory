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

      <div className="cards-container">
        <div className="card total">
          <h4>Total Items</h4>
          <p>{inventoryStats.totalItems}</p>
        </div>

        <div className="card low-stock">
          <h4>Low Stock Items</h4>
          <p>{inventoryStats.lowStock}</p>
        </div>

        <div className="card expired">
          <h4>Expired Items</h4>
          <p>{inventoryStats.expiredItems}</p>
        </div>

        <div className="card out-of-stock">
          <h4>Out of Stock Items</h4>
          <p>{inventoryStats.outOfStock}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
