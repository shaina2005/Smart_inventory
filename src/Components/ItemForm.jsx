import React from "react";
import "../Pages/Inventory.css";

function ItemForm({ newItem, setNewItem, onSave, onCancel, mode, sending }) {
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onCancel}>
          ×
        </button>
        <h3>{mode === "add" ? "Add New Item" : "Edit Item"}</h3>
        <form onSubmit={onSave}>
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
            <option value="">Select Department</option>
            <option value="Banquet & Events">Banquet & Events</option>
            <option value="Engineering & Maintenance">
              Engineering & Maintenance
            </option>
            <option value="F&B production">F&B production</option>
            <option value="F&B service">F&B service</option>
            <option value="Front office">Front office</option>
            <option value="Housekeeping">Housekeeping</option>
            {/* <option value="Security Departments">Security Departments</option> */}
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
            <option value="">Select Unit</option>
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="pcs">pcs</option>
            <option value="btl">btl</option>
            <option value="ltr">ltr</option>
            <option value="ml">ml</option>
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
            placeholder="Expiry date (optional)"
            value={newItem.item_expirydate}
            onChange={handleChange}
          />

          <div className="form-actions">
            <button type="submit" className="save-btn">
              {sending ? (
                <div className="spinner"></div>
              ) : mode === "add" ? (
                "Save"
              ) : (
                "Update"
              )}{" "}
            </button>
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ItemForm;
