import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdDelete, MdOutlineModeEdit } from "react-icons/md";
import { BiMinusCircle } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";

import "./Inventory.css";
import ItemForm from "../Components/ItemForm";

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const role = localStorage.getItem("role");
  const [qtyUsed, setQtyUsed] = useState("");
  const [useOpen, setUseOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [result, setResult] = useState();

  // Modal state for add/edit item
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    item_name: "",
    item_department: "",
    item_unit: "pcs",
    item_quantity: "",
    item_location: "",
    item_expirydate: "",
  });
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"

  // Modal state for stats cards
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [statsModalItems, setStatsModalItems] = useState([]);
  const [statsModalTitle, setStatsModalTitle] = useState("");

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://smart-inventory-mx5v.onrender.com/items"
      );
      const updatedInventory = response.data
        .map((item) => {
          let status;
          const today = new Date();

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
        })
        .sort((a, b) => {
          const nameA = (a.item_name || "").trim().toLowerCase();
          const nameB = (b.item_name || "").trim().toLowerCase();
          return nameA > nameB ? 1 : nameA < nameB ? -1 : 0;
        });

      setInventory(updatedInventory);
      setError(null);
    } catch (err) {
      setError("Failed to fetch inventory data");
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  // Stats modal
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

  // Form handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (
        !newItem.item_name ||
        !newItem.item_unit ||
        !newItem.item_quantity ||
        !newItem.item_department ||
        !newItem.item_location
      ) {
        setResult({ message: "Please fill all required fields!" });
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
        return;
      }

      if (modalMode === "add") {
        const response = await axios.post(
          "https://smart-inventory-mx5v.onrender.com/items",
          newItem
        );
        setResult(response.data);
      } else {
        const response = await axios.put(
          `https://smart-inventory-mx5v.onrender.com/items/${newItem._id}`,
          newItem
        );
        setResult(response.data);
      }

      await fetchInventoryData();
      setIsModalOpen(false);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (err) {
      console.error("Error saving item:", err);
      setResult({ message: "Error saving item" });
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  const handleAddClick = () => {
    setNewItem({
      item_name: "",
      item_department: "",
      item_unit: "pcs",
      item_quantity: "",
      item_location: "",
      item_expirydate: "",
    });
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleEditClick = (item) => {
    setNewItem(item);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewItem({
      item_name: "",
      item_department: "",
      item_quantity: "",
      item_unit: "",
      item_location: "",
      item_expirydate: "",
    });
  };

  // Stats calculation
  const calculateStats = () => {
    const totalItems = inventory.length;
    const lowStock = inventory.filter(
      (item) => item.item_status === "low-stock"
    ).length;
    const outOfStock = inventory.filter(
      (item) => item.item_status === "out-of-stock"
    ).length;
    const today = new Date();
    const expiredItems = inventory.filter(
      (item) => item.item_expirydate && new Date(item.item_expirydate) < today
    ).length;

    return { totalItems, lowStock, expiredItems, outOfStock };
  };

  const inventoryStats = calculateStats();

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.item_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || item.item_status === filterStatus;
    const matchesDepartment =
      departmentFilter === "all" || item.item_department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusInfo = (quantity, expiryDate) => {
    const today = new Date();
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      if (expiry < today) return { text: "Expired", className: "expired" };
    }
    if (quantity === 0)
      return { text: "Out of Stock", className: "out-of-stock" };
    if (quantity < 2) return { text: "Low Stock", className: "low-stock" };
    return { text: "Good", className: "good" };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Use item modal
  const useItem = (item) => {
    setUseOpen(true);
    setSelectedItem(item);
  };

  const updateQuantity = async (item, e) => {
    e.preventDefault();
    if (!qtyUsed || qtyUsed <= 0) {
      setResult({ message: "Please enter a valid quantity!" });
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }
    if (qtyUsed > item.item_quantity) {
      setResult({ message: "Used quantity exceeds available stock!" });
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }
    try {
      const response = await axios.put(
        `https://smart-inventory-mx5v.onrender.com/items/use/${item._id}`,
        { usedQuantity: parseInt(qtyUsed) }
      );
      setInventory((prev) =>
        prev.map((inv) =>
          inv._id === item._id
            ? { ...inv, item_quantity: inv.item_quantity - parseInt(qtyUsed) }
            : inv
        )
      );
      setUseOpen(false);
      setQtyUsed("");
      setResult(response.data);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error("Error updating quantity:", error);
      setResult({ message: "Failed to update quantity" });
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await axios.delete(
          `https://smart-inventory-mx5v.onrender.com/items/${itemId}`
        );
        setInventory(inventory.filter((item) => item._id !== itemId));
        setResult(response.data);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
      } catch (err) {
        console.error("Error deleting item:", err);
        setResult({ message: "Failed to delete item!" });
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
      }
    }
  };

  if (loading) return <div className="loading">Loading ...</div>;
  if (error)
    return (
      <div className="error">
        Error: {error} <button onClick={fetchInventoryData}>Retry</button>
      </div>
    );

  // Capitalize the first letter and make the rest lowercase
  const capitalizeFirst = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <div className="inventory-page">
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

        <div className="stat-card" onClick={() => openStatsModal("low-stock")}>
          <div className="stat-icon low">⏰</div>
          <div className="stat-content">
            <h4>Low Stock Items</h4>
            <p>Number of items that are running low</p>
            <span className="stat-value">{inventoryStats.lowStock}</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => openStatsModal("expired")}>
          <div className="stat-icon expired">⚠️</div>
          <div className="stat-content">
            <h4>Expired Items</h4>
            <p>Number of items of their expiration date</p>
            <span className="stat-value">{inventoryStats.expiredItems}</span>
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
            <span className="stat-value">{inventoryStats.outOfStock}</span>
          </div>
        </div>
      </div>

      {/* Inventory Table Section */}
      <div className="inventory-section">
        <div className="section-header">
          <h3>Inventory Overview</h3>
          <div className="table-controls">
            <div className="search-box">
              <FiSearch size={18} />

              <input
                type="text"
                placeholder="Search Item"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="section-header">
  <div className="filter-dropdown">
    <select
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
    >
      <option value="all">All</option>
      <option value="good-stock">Good</option>
      <option value="low-stock">Low Stock</option>
      <option value="out-of-stock">Out of Stock</option>
      <option value="expired">Expired</option>
    </select>
  </div>

  <div className="filter-dropdown">
    <select
      value={departmentFilter}
      onChange={(e) => setDepartmentFilter(e.target.value)}
    >
      <option value="all">Department</option>
      <option value="Banquet & Events">Banquet & Events</option>
      <option value="Engineering & Maintenance">Engineering & Maintenance</option>
      <option value="F&B production">F&B production</option>
      <option value="F&B service">F&B service</option>
      <option value="Front office">Front office</option>
      <option value="Housekeeping">Housekeeping</option>
      <option value="Security Departments">Security Departments</option>
      <option value="others">Other</option>
    </select>
  </div>
</div>

            {role === "admin" && (
              <button className="add-item-btn" onClick={handleAddClick}>
                + Add Item
              </button>
            )}
          </div>
        </div>

        <div className="table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Storage Location</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Department</th>
                {role === "admin" && <th>Action</th>}
                {role === "staff" && <th></th>}
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item, index) => {
                const statusInfo = getStatusInfo(
                  item.item_quantity,
                  item.item_expirydate
                );
                return (
                  <tr key={item._id || index}>
                    <td>{capitalizeFirst(item.item_name)}</td>
                    <td>{item.item_quantity}</td>
                    <td>{item.item_unit}</td>
                    <td>{capitalizeFirst(item.item_location)}</td>
                    <td>
                      {item.item_expirydate
                        ? formatDate(item.item_expirydate)
                        : "N/A"}
                    </td>
                    <td>
                      <span className={`status ${statusInfo.className}`}>
                        {statusInfo.text}
                      </span>
                    </td>
                    <td>{item.item_department}</td>
                    {role === "admin" && (
                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-btn"
                            onClick={() => handleEditClick(item)}
                          >
                            <MdOutlineModeEdit size={20} />
                          </button>
                          <MdDelete
                            size={20}
                            className="delete-icon"
                            onClick={() => handleDelete(item._id)}
                          />
                        </div>
                      </td>
                    )}
                    {role === "staff" && (
                      <td>
                        <button
                          className="use-item-btn"
                          onClick={() => useItem(item)}
                        >
                          <BiMinusCircle size={25} />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      {isModalOpen && (
        <ItemForm
          newItem={newItem}
          setNewItem={setNewItem}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
          mode={modalMode}
        />
      )}

      {/* Use Item Modal */}
      {useOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setUseOpen(false)}>
              ×
            </button>
            <h3>{selectedItem.item_name}</h3>
            <form>
              <input
                type="number"
                placeholder="Enter quantity used"
                value={qtyUsed}
                onChange={(e) => setQtyUsed(e.target.value)}
                min="1"
                max={selectedItem.item_quantity}
                required
              />
              <div className="form-actions">
                <button
                  type="submit"
                  className="save-btn"
                  onClick={(e) => updateQuantity(selectedItem, e)}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setUseOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      {/* Popup */}
      {showPopup && (
        <div
          className="popup-message"
          style={{ backgroundColor: result?.backgroundColor }}
        >
          {result && <span>{result.message}</span>}
        </div>
      )}
    </div>
  );
}

export default Inventory;
