import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = ({ notificationsOn, dndOn, setDnd }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch inventory
  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/items");

// Add status calculation logic
const updatedInventory = res.data.map((item) => {
  const today = new Date();
  const expiry = new Date(item.item_expirydate);
  let status;

  if (expiry < today) status = "expired";
  else if (item.item_quantity === 0) status = "out-of-stock";
  else if (item.item_quantity < 5) status = "low-stock";
  else status = "good-stock";

  return { ...item, item_status: status };
});

setInventory(updatedInventory);

      setError(null);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError("Failed to fetch inventory data");
    } finally {
      setLoading(false);
    }
  };

  // calculate stats
  const calculateStats = () => {
    const totalItems = inventory.length;
    const lowStock = inventory.filter((i) => i.item_status === "low-stock").length;
    const outOfStock = inventory.filter((i) => i.item_status === "out-of-stock").length;

    const today = new Date();
    const expiredItems = inventory.filter((i) => new Date(i.item_expirydate) < today).length;

    return { totalItems, lowStock, expiredItems, outOfStock };
  };

  const stats = calculateStats();

  // auto turn off DND
  useEffect(() => {
    if (dndOn) {
      const timer = setTimeout(() => setDnd(false), 12 * 60 * 60 * 1000);
      return () => clearTimeout(timer);
    }
  }, [dndOn, setDnd]);

  const notifications = [
    { id: 1, type: "expired", message: "Item 'Milk' has expired!" },
    { id: 2, type: "low-stock", message: "Item 'Fire Extinguisher' stock dropped to 2!" },
    { id: 3, type: "restocked", message: "Item 'Gloves' restocked successfully." },
    { id: 4, type: "info", message: "New supplier added to the system." },
  ];

  if (loading) return <p>Loading stats...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="dashboard">
      <h2>Inventory Dashboard</h2>
      <p className="date">Today, {new Date().toDateString()}</p>

      {/* Statistics Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon total">📄</div>
          <div className="stat-content">
            <h4>Total Items</h4>
            <p>Total items in stock</p>
            <span className="stat-value">{stats.totalItems}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon low">⏰</div>
          <div className="stat-content">
            <h4>Low Stock Items</h4>
            <p>Number of items that are running low</p>
            <span className="stat-value">{stats.lowStock}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon expired">⚠️</div>
          <div className="stat-content">
            <h4>Expired Items</h4>
            <p>Number of items past expiration</p>
            <span className="stat-value">{stats.expiredItems}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon out">📦</div>
          <div className="stat-content">
            <h4>Out of Stock Items</h4>
            <p>Count of items currently out of stock</p>
            <span className="stat-value">{stats.outOfStock}</span>
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
              <div key={note.id} className="notification-item">
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
  ``