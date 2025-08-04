import React from "react";


 
  const inventoryStats = {
    totalItems: 120,
    lowStock: 8,
    expiredItems: 40,
    outOfStock: 15
  };

function Inventory() {
  // Sample data (will be replaced with API data later)
  const inventory = [
    {
      name: "Tomatoes",
      image: "🍅",
      quantity: "120kg",
      location: "Freezer",
      date: "Aug 15, 2024, 14:30",
      status: "Good",
    },
    {
      name: "Chicken Breast",
      image: "🍗",
      quantity: "40kg",
      location: "Freezer",
      date: "Aug 15, 2024, 14:30",
      status: "Low Stock",
    },
    {
      name: "Egg",
      image: "🥚",
      quantity: "0kg",
      location: "Freezer 2",
      date: "Aug 15, 2024, 14:30",
      status: "Out of Stock",
    },
  ];

  return (
    <div className="inventory-page">
      <h2>Inventory Management</h2>
      <p className="date">Today, August 16th 2024</p>

      {/* Cards */}
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

      {/* Inventory Table */}
      <h3>Inventory Overview</h3>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Image</th>
            <th>Quantity</th>
            <th>Storage</th>
            <th>Last Updated</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>{item.image}</td>
              <td>{item.quantity}</td>
              <td>{item.location}</td>
              <td>{item.date}</td>
              <td>
                <span className={`status ${item.status.replace(" ", "-").toLowerCase()}`}>
                  {item.status}
                </span>
              </td>
              <td>
                <button>Edit</button>
                <button>⋯</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
