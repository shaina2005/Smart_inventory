import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { MdOutlineModeEdit } from "react-icons/md";
import { BiMinusCircle } from "react-icons/bi";
import "./Inventory.css";

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [result, setResult] = useState();
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const role = localStorage.getItem("role");
  const [qtyUsed, setQtyUsed] = useState("");
  const [useOpen, setUseOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    item_name: "",
    item_department: "",
    item_unit: "",
    item_quantity: "",
    item_location: "",
    item_expirydate: "",
  });

  // Fetch inventory data from backend
  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/items");
      const updatedInventory = response.data
        .map((item) => {
          let status;
          const today = new Date();
          const expiry = new Date(item.item_expirydate);

          if (expiry < today) {
            status = "expired"; // Expired overrides everything
          } else if (item.item_quantity === 0) {
            status = "out-of-stock";
          } else if (item.item_quantity < 5) {
            status = "low-stock";
          } else {
            status = "good-stock";
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
      const respone = await axios.post("http://localhost:5000/items", newItem);
      console.log(respone.data);

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
      item_department: "",
      item_quantity: "",
      item_unit: "",
      item_location: "",
      item_expirydate: "",
    });
  };

  // Calculate statistics
  const calculateStats = () => {
    const totalItems = inventory.length;
    const lowStock = inventory.filter(
      (item) => item.item_status === "low-stock"
    ).length;
    const outOfStock = inventory.filter(
      (item) => item.item_status === "out-of-stock"
    ).length;

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
    const expiry = new Date(expiryDate);

    if (expiry < today) {
      return { text: "Expired", className: "expired" };
    } else if (quantity === 0) {
      return { text: "Out of Stock", className: "out-of-stock" };
    } else if (quantity < 5) {
      return { text: "Low Stock", className: "low-stock" };
    } else {
      return { text: "Good", className: "good" };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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

  //use item form
  const useItem = (item) => {
    console.log("item used");
    setUseOpen(true);
    setSelectedItem(item);
  };

  const updateQuantity = (item, e) => {
    e.preventDefault();

    setUseOpen(false);
    console.log("quantity updated");
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
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All </option>
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
                <option value="all">Department </option>
                <option value="Administration & HR">Administration & HR</option>
                <option value="Banquet & Events">Banquet & Events</option>
                <option value="Engineering & Maintenance">
                  Engineering & Maintenance
                </option>
                <option value="F&B production">F&B production</option>
                <option value="F&B service">F&B service</option>
                <option value="Front office">Front office</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Security Departments">
                  Security Departments
                </option>
                <option value="others">Other</option>
              </select>
            </div>
            {role === "admin" && (
              <button className="add-item-btn" onClick={openModal}>
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
                    <td>{item.item_name}</td>

                    <td>{item.item_quantity}</td>
                    <td>{item.item_unit}</td>
                    <td>{item.item_location}</td>
                    <td>{formatDate(item.item_expirydate)}</td>
                    <td>
                      <span className={`status ${statusInfo.className}`}>
                        {statusInfo.text}
                      </span>
                    </td>
                    <td>{item.item_department}</td>
                    {role === "admin" && (
                      <td>
                        <div className="action-buttons">
                          <button className="edit-btn">
                            <MdOutlineModeEdit size={20} />
                          </button>
                          <MdDelete
                            size={20}
                            style={{ color: "rgba(232, 37, 37, 1)" }}
                          />
                          {/* <div className="dropdown">
                            <MdDelete size={20} />
                            <button className="more-btn">⋯</button>
                            <div className="dropdown-content">
                              <button>View Details</button>
                              <button>Delete</button>
                            </div>
                          </div> */}
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

                    {/* <td>
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
                    </td> */}
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
            <button className="close-btn" onClick={closeModal}>
              ×
            </button>
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
              <select
                name="item_department"
                value={newItem.item_department}
                onChange={handleChange}
              >
                <option value="all">Department </option>
                <option value="Administration & HR">Administration & HR</option>
                <option value="Banquet & Events">Banquet & Events</option>
                <option value="Engineering & Maintenance">
                  Engineering & Maintenance
                </option>
                <option value="F&B production">F&B production</option>
                <option value="F&B service">F&B service</option>
                <option value="Front office">Front office</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Security Departments">
                  Security Departments
                </option>
                <option value="others">Other</option>
              </select>

              <input
                type="number"
                name="item_quantity"
                placeholder="Quantity"
                value={newItem.item_quantity}
                onChange={handleChange}
                required
              />
              <select
                name="item_unit"
                value={newItem.item_unit}
                onChange={handleChange}
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="pcs">pcs</option>
                <option value="btl">btl</option>
                <option value="ltr">ltr</option>
              </select>
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
                placeholder="Expiry date"
                value={newItem.item_expirydate}
                onChange={handleChange}
              />

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {useOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setUseOpen(false)}>
              ×
            </button>
            <h3> {selectedItem.item_name}</h3>
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
    </div>
  );
}

export default Inventory;
