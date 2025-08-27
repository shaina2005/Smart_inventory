import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Inventory.css";

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    item_name: "",
    item_image: "",
    item_quantity: "",
    item_location: "",
    item_expirydate: "",
    item_status: "good-stock",
  });

  // Fetch inventory data from backend
  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/items");
      setInventory(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch inventory data");
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // Handle form submit (for now, just add to local state)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // post to backend
      await axios.post("http://localhost:5000/items", newItem);
      fetchInventoryData(); // reload data
      closeModal();
    } catch (err) {
      console.error("Error saving item:", err);
    }
  };

  // Modal controls
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewItem({
      item_name: "",
      item_image: "",
      item_quantity: "",
      item_location: "",
      item_expirydate: "",
      item_status: "good-stock",
    });
  };

  // Calculate statistics
  const calculateStats = () => {
    const totalItems = inventory.length;
    const lowStock = inventory.filter((item) => item.item_status === "low-stock").length;
    const outOfStock = inventory.filter((item) => item.item_status === "out-of-stock").length;

    const today = new Date();
    const expiredItems = inventory.filter((item) => {
      const expiryDate = new Date(item.item_expirydate);
      return expiryDate < today;
    }).length;

    return {
      totalItems,
      lowStock,
      expiredItems,
      outOfStock,
    };
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || item.item_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusInfo = (status, expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);

    if (expiry < today) {
      return { text: "Expired", className: "expired" };
    }

    switch (status) {
      case "good-stock":
        return { text: "Good", className: "good" };
      case "low-stock":
        return { text: "Low Stock", className: "low-stock" };
      case "out-of-stock":
        return { text: "Out of Stock", className: "out-of-stock" };
      default:
        return { text: status, className: "unknown" };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const inventoryStats = calculateStats();

  if (loading) {
    return (
      <div className="inventory-page">
        <div className="loading">Loading inventory data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inventory-page">
        <div className="error">Error: {error}</div>
        <button onClick={fetchInventoryData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="inventory-page">
      {/* Statistics Cards */}
      <div className="cards-container">
        <div className="card total">
          <div className="card-icon">📄</div>
          <div className="card-content">
            <h4>Total Items</h4>
            <p className="card-description">Total Items in stock</p>
            <p className="card-value">{inventoryStats.totalItems}</p>
          </div>
        </div>

        <div className="card low-stock">
          <div className="card-icon">⏰</div>
          <div className="card-content">
            <h4>Low Stock Items</h4>
            <p className="card-description">Number of items that are running low</p>
            <p className="card-value">{inventoryStats.lowStock}</p>
          </div>
        </div>

        <div className="card expired">
          <div className="card-icon">⚠️</div>
          <div className="card-content">
            <h4>Expired Items</h4>
            <p className="card-description">Number of items past their expiration date</p>
            <p className="card-value">{inventoryStats.expiredItems}</p>
          </div>
        </div>

        <div className="card out-of-stock">
          <div className="card-icon">📦</div>
          <div className="card-content">
            <h4>Out of Stock Items</h4>
            <p className="card-description">Count of items currently out of stock</p>
            <p className="card-value">{inventoryStats.outOfStock}</p>
          </div>
        </div>
      </div>

      {/* Inventory Table Section */}
      <div className="inventory-section">
        <div className="section-header">
          <h3>Inventory Overview</h3>
          <div className="table-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search Item"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-dropdown">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="good-stock">Good</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
            <button className="add-item-btn" onClick={openModal}>
              + Add Item
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Image</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Storage Location</th>
                <th>Last Updated</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item, index) => {
                const statusInfo = getStatusInfo(item.item_status, item.item_expirydate);
                return (
                  <tr key={item._id || index}>
                    <td>{item.item_name}</td>
                    <td>
                      <div className="item-image">{item.item_image || "🍽️"}</div>
                    </td>
                    <td>{item.item_quantity}</td>
                    <td>{item.item_unit}</td>
                    <td>{item.item_location}</td>
                    <td>{formatDate(item.item_expirydate)}</td>
                    <td>
                      <span className={`status ${statusInfo.className}`}>{statusInfo.text}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-btn">✏️</button>
                        <div className="dropdown">
                          <button className="more-btn">⋯</button>
                          <div className="dropdown-content">
                            <button>View Details</button>
                            <button>Delete</button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}>×</button>
            <h3>Add New Item</h3>
            <form onSubmit={handleSave}>
              <input
                type="text"
                name="item_name"
                placeholder="Item Name"
                value={newItem.item_name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="item_image"
                placeholder="Image URL"
                value={newItem.item_image}
                onChange={handleChange}
              />
              <input
                type="number"
                name="item_quantity"
                placeholder="Quantity (kg)"
                value={newItem.item_quantity}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="item_location"
                placeholder="Storage Location"
                value={newItem.item_location}
                onChange={handleChange}
              />
              <input
                type="date"
                name="item_expirydate"
                value={newItem.item_expirydate}
                onChange={handleChange}
                required
              />
              <select
                name="item_status"
                value={newItem.item_status}
                onChange={handleChange}
              >
                <option value="good-stock">Good</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>

              <div className="form-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
