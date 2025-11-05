import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = ({ notificationsOn, dndOn, setDnd }) => {
  const [inventory, setInventory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stats modal
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [statsModalItems, setStatsModalItems] = useState([]);
  const [statsModalTitle, setStatsModalTitle] = useState("");

  // Fetch inventory
  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://smart-inventory-mx5v.onrender.com/items"
      );
      const today = new Date();

      const updatedInventory = res.data.map((item) => {
        let status;

        if (item.item_expirydate) {
          const expiry = new Date(item.item_expirydate);
          if (expiry < today) status = "expired";
          else if (item.item_quantity === 0) status = "out-of-stock";
          else if (item.item_quantity < 2) status = "low-stock";
          else status = "good-stock";
        } else {
          if (item.item_quantity === 0) status = "out-of-stock";
          else if (item.item_quantity < 2) status = "low-stock";
          else status = "good-stock";
        }

        return { ...item, item_status: status };
      });

      setInventory(updatedInventory);
      setError(null);

      generateNotifications(updatedInventory);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError("Failed to fetch inventory data");
    } finally {
      setLoading(false);
    }
  };

  const generateNotifications = (inventoryData) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const newNotifications = [];

    inventoryData.forEach((item) => {
      const expiryDate = item.item_expirydate
        ? new Date(item.item_expirydate)
        : null;

      if (expiryDate && expiryDate < today) {
        newNotifications.push({
          message: `${item.item_name} has expired`,
          type: "alert",
        });
      }
      if (expiryDate && expiryDate.toDateString() === tomorrow.toDateString()) {
        newNotifications.push({
          message: `${item.item_name} is expiring tomorrow`,
          type: "warning",
        });
      }
      if (item.item_quantity > 0 && item.item_quantity <= 2) {
        newNotifications.push({
          message: `${item.item_name} stock is low (${item.item_quantity})`,
          type: "warning",
        });
      }
      if (item.item_quantity === 0) {
        newNotifications.push({
          message: `${item.item_name} is out of stock`,
          type: "alert",
        });
      }
    });

    setNotifications(newNotifications);
  };

  const calculateStats = () => {
    const totalItems = inventory.length;
    const lowStock = inventory.filter(
      (i) => i.item_status === "low-stock"
    ).length;
    const outOfStock = inventory.filter(
      (i) => i.item_status === "out-of-stock"
    ).length;
    const today = new Date();
    const expiredItems = inventory.filter(
      (i) => i.item_expirydate && new Date(i.item_expirydate) < today
    ).length;

    return { totalItems, lowStock, expiredItems, outOfStock };
  };

  const stats = calculateStats();

  const openStatsModal = (type) => {
    let itemsToShow = [];
    let title = "";
    const today = new Date();

    switch (type) {
      case "low-stock":
        itemsToShow = inventory.filter(
          (item) => item.item_status === "low-stock"
        );
        title = "Low Stock Items";
        break;
      case "out-of-stock":
        itemsToShow = inventory.filter(
          (item) => item.item_status === "out-of-stock"
        );
        title = "Out of Stock Items";
        break;
      case "expired":
        itemsToShow = inventory.filter(
          (item) =>
            item.item_expirydate && new Date(item.item_expirydate) < today
        );
        title = "Expired Items";
        break;
      default:
        itemsToShow = [];
    }

    setStatsModalItems(itemsToShow);
    setStatsModalTitle(title);
    setStatsModalOpen(true);
  };

  // Auto turn off DND after 12 hours
  useEffect(() => {
    if (dndOn) {
      const timer = setTimeout(() => setDnd(false), 12 * 60 * 60 * 1000);
      return () => clearTimeout(timer);
    }
  }, [dndOn, setDnd]);

  const clearNotifications = () => setNotifications([]);

  if (loading) return <div className="loading">Loading ...</div>;
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

        <div className="stat-card" onClick={() => openStatsModal("low-stock")}>
          <div className="stat-icon low">⏰</div>
          <div className="stat-content">
            <h4>Low Stock Items</h4>
            <p>Number of items that are running low</p>
            <span className="stat-value">{stats.lowStock}</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => openStatsModal("expired")}>
          <div className="stat-icon expired">⚠️</div>
          <div className="stat-content">
            <h4>Expired Items</h4>
            <p>Number of items past expiration</p>
            <span className="stat-value">{stats.expiredItems}</span>
          </div>
        </div>

        <div
          className="stat-card"
          onClick={() => openStatsModal("out-of-stock")}
        >
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
          <button onClick={clearNotifications}>Clear</button>
        </div>
        <div className="notifications">
          {dndOn ? (
            <div className="notification-item">Do Not Disturb is on</div>
          ) : notificationsOn ? (
            notifications.length > 0 ? (
              notifications.map((note, idx) => (
                <div key={idx} className={`notification-item ${note.type}`}>
                  {note.message}
                </div>
              ))
            ) : (
              <div className="notification-item">No new notifications</div>
            )
          ) : (
            <div className="notification-item">Notifications are off</div>
          )}
        </div>
      </div>

      {/* Stats Modal */}
      {statsModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setStatsModalOpen(false)}
            >
              ×
            </button>
            <h3>{statsModalTitle}</h3>
            <ul className="stats-item-list">
              {statsModalItems.map((item) => {
                const departmentColors = {
                  "Administration & HR": "#28a745",
                  "Banquet & Events": "#ff8c00",
                  "Engineering & Maintenance": "#6f42c1",
                  "F&B production": "#dc3545",
                  "F&B service": "#17a2b8",
                  "Front office": "#ffc107",
                  Housekeeping: "#20c997",
                  "Security Departments": "#343a40",
                  others: "#6c757d",
                };
                const deptColor =
                  departmentColors[item.item_department] || "#007bff";

                return (
                  <li key={item._id}>
                    {item.item_name} -{" "}
                    <span style={{ color: deptColor, fontWeight: "bold" }}>
                      {item.item_department}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
