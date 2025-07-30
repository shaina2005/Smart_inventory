import React from "react";

const Sidebar = ({ isOpen }) => {
  return (
    <div>
      <div className={`sidebar ${isOpen ? "active" : ""}`}>
        <a href="#">Dashboard</a>
        <a href="#">Products</a>
        <a href="#">Inventory</a>
      </div>
    </div>
  );
};

export default Sidebar;
