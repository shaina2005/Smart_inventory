import React from "react";
import { useEffect } from "react";
const Dashboard = ({ notificationsOn, dndOn, setDnd }) => {
  const inventoryStats = {
    totalItems: 120,
    lowStock: 8,
    expiredItems: 40,
    outOfStock: 15,
  };
  useEffect(() => {
    if (dndOn) {
      const timer = setTimeout(() => {
        setDnd(false); // automatically turn off DND after 12 hours
      }, 12 * 60 * 60 * 1000); // 12 hours in milliseconds

      return () => clearTimeout(timer);
    }
  }, [dndOn, setDnd]);

  const notifications = [
    { id: 1, type: "expired", message: "Item 'Milk' has expired!" },
    {
      id: 2,
      type: "low-stock",
      message: "Item 'Fire Extinguisher' stock dropped to 2!",
    },
    {
      id: 3,
      type: "restocked",
      message: "Item 'Gloves' restocked successfully.",
    },
    { id: 4, type: "info", message: "New supplier added to the system." },
  ];

  const getTextColor = (type) => {
    switch (type) {
      case "expired":
        return "#B91C1C"; // dark red
      case "low-stock":
        return "#92400E"; // dark yellow
      case "restocked":
        return "#166534"; // dark green
      case "info":
        return "#1E40AF"; // dark blue
      default:
        return "#374151"; // grey
    }
  };
  const getNotificationColor = (type) => {
    switch (type) {
      case "expired":
        return "#FEE2E2"; // light red
      case "low-stock":
        return "#FEF3C7"; // light yellow
      case "restocked":
        return "#DCFCE7"; // light green
      case "info":
        return "#DBEAFE"; // light blue
      default:
        return "#F3F4F6"; // light grey
    }
  };
  return (
    <div className="dashboard">
      <h2>Inventory Dashboard</h2>
      <p className="date">Today, August 16th 2024</p>

      {/* Statistics Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon total">📄</div>
          <div className="stat-content">
            <h4>Total Items</h4>
            <p>Total items in stock</p>
            <span className="stat-value">{inventoryStats.totalItems}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon low">⏰</div>
          <div className="stat-content">
            <h4>Low Stock Items</h4>
            <p>Number of items that are running low</p>
            <span className="stat-value">{inventoryStats.lowStock}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon expired">⚠️</div>
          <div className="stat-content">
            <h4>Expired Items</h4>
            <p>Number of items of their expiration date</p>
            <span className="stat-value">{inventoryStats.expiredItems}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon out">📦</div>
          <div className="stat-content">
            <h4>Out of Stock Items</h4>
            <p>Count of items currently out of stock</p>
            <span className="stat-value">{inventoryStats.outOfStock}</span>
          </div>
        </div>
      </div>
      {/* Notification Panel */}
      <div className="notification-panel">
        <div className="notification-bar">
          <h3>Notifications</h3>
          <button>Clear</button>
        </div>
        <div className="notifications">
          {dndOn ? (
            <div className="notification-item">Do Not Disturb is on</div>
          ) : notificationsOn ? (
            notifications.map((note) => (
              <div
                key={note.id}
                className="notification-item"
                // style={{
                //   backgroundColor: getNotificationColor(note.type),
                //   color: getTextColor(note.type),
                // }}
              >
                {note.message}
              </div>
            ))
          ) : (
            <div className="notification-item">Notifications are off</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
