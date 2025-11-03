import React, { useState, useEffect } from "react";
import "./Indent.css";
import { MdDelete } from "react-icons/md";

import axios from "axios";

const Indent = () => {
  const [loading, setLoading] = useState(true);
  const [purpose, setPurpose] = useState("");
  const [requiredBy, setRequiredBy] = useState("");
  const [requiredTime, setRequiredTime] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [items, setItems] = useState([
    { item_name: "", specification: "", quantity: "", remarks: "" },
  ]);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");
  const [indents, setIndents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const role = localStorage.getItem("role");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (role === "admin") {
      const fetchIndents = async () => {
        try {
          setLoading(true);

          const res = await axios.get("https://smart-inventory-mx5v.onrender.com/indent");
          setIndents(res.data);
        } catch (err) {
          console.log("Error fetching indents:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchIndents();
    }
  }, [role]);
  if (loading) return <div className="loading">Loading Indents ...</div>;

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this indent?")) {
      try {
        const response = await axios.delete(
          `https://smart-inventory-mx5v.onrender.com/indent/${id}`
        );

        setIndents(indents.filter((indent) => indent._id !== id));
        setResult(response.data);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
      } catch (error) {
        console.error("Error deleting indent:", error);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
      }
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { item_name: "", specification: "", quantity: "", remarks: "" },
    ]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://smart-inventory-mx5v.onrender.com/indent", {
        purpose,
        requiredBy,
        requestedBy,
        requiredTime,
        items,
        notes,
      });
      setResult(response.data);
      setShowPopup(true);

      if (result.success == "true") {
        setPurpose("");
        setRequestedBy("");
        setRequiredBy("");
        setRequiredTime("");
        setItems([
          { item_name: "", specification: "", quantity: "", remarks: "" },
        ]);
        setNotes("");
      }
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    } catch (error) {
      console.log("error in friontend handlesubmit");
    }
  };

  return (
    <>
      {role === "admin" ? (
        <div className="admin-indent-container">
          <div className="admin-indent-header">
            <h2 className="admin-indent-title">Indent Requests</h2>

            {/* Search Filter */}
            <div className="admin-indent-filter">
              <input
                type="text"
                placeholder="Search by Requested By..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-indent-table-container">
            <table className="admin-indent-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Date</th>
                  <th>Purpose</th>
                  <th>Requested By</th>
                  <th>Required By</th>
                  <th>Required Time</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Specification</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {indents
                  .filter((indent) =>
                    indent.requestedBy
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((indent, index) =>
                    indent.items.map((item, i) => (
                      <tr key={`${indent._id}-${i}`}>
                        {i === 0 && (
                          <>
                            <td rowSpan={indent.items.length}>{index + 1}</td>
                            {i === 0 && (
                              <td rowSpan={indent.items.length}>
                                {new Date(
                                  indent.createdAt
                                ).toLocaleDateString()}
                              </td>
                            )}
                            <td rowSpan={indent.items.length}>
                              {indent.purpose}
                            </td>
                            <td rowSpan={indent.items.length}>
                              {indent.requestedBy}
                            </td>
                            <td rowSpan={indent.items.length}>
                              {indent.requiredBy}
                            </td>
                            <td rowSpan={indent.items.length}>
                              {indent.requiredTime}
                            </td>
                          </>
                        )}
                        <td>{item.item_name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.specification}</td>
                        <td>{item.remarks}</td>

                        {i === 0 && (
                          <td
                            rowSpan={indent.items.length}
                            className="delete-cell"
                            onClick={() => handleDelete(indent._id)}
                            title="Delete this indent"
                          >
                            <MdDelete className="delete-icon" size={20} />
                          </td>
                        )}
                      </tr>
                    ))
                  )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="indentpage-container">
          <h2 className="indentpage-title">New Indent Request</h2>

          <form className="indentpage-form">
            <div className="indentpage-group">
              <label>Purpose</label>
              <input
                type="text"
                placeholder="Purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>

            <div className="indentpage-row">
              <div className="indentpage-group">
                <label>Required By</label>
                <input
                  type="date"
                  value={requiredBy}
                  onChange={(e) => setRequiredBy(e.target.value)}
                />
              </div>
              <div className="indentpage-group">
                <label>Time</label>
                <input
                  type="text"
                  placeholder="eg : 10:00 AM"
                  value={requiredTime}
                  onChange={(e) => setRequiredTime(e.target.value)}
                />
              </div>
            </div>

            <div className="indentpage-group">
              <label>Requested By</label>
              <input
                type="text"
                placeholder="eg : Riya sharma"
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
              />
            </div>

            <table className="indentpage-table">
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Item Name</th>
                  <th>Specification</th>
                  <th>Quantity</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <input
                        type="text"
                        placeholder="e.g. Apple"
                        value={item.item_name}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].item_name = e.target.value;
                          setItems(newItems);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Specification"
                        value={item.specification}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].specification = e.target.value;
                          setItems(newItems);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="eg : 2kg"
                        value={item.quantity}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].quantity = e.target.value;
                          setItems(newItems);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Remarks"
                        value={item.remarks}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].remarks = e.target.value;
                          setItems(newItems);
                        }}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="indentpage-btn-remove"
                        onClick={() => handleRemoveItem(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              type="button"
              className="indentpage-btn-add"
              onClick={handleAddItem}
            >
              + Add Item
            </button>

            <div className="indentpage-group">
              <label>Recommendation or Notes</label>
              <textarea
                placeholder="Write any notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>

            <div className="indentpage-buttons">
              <button
                type="submit"
                className="indentpage-btn-submit"
                onClick={handleSubmit}
              >
                Submit Indent
              </button>
              <button type="button" className="indentpage-btn-cancel">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {showPopup && (
        <div
          className="popup-message"
          style={{ backgroundColor: result?.backgroundColor }}
        >
          {result && <span>{result.message}</span>}
        </div>
      )}
    </>
  );
};

export default Indent;
