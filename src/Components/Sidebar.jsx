import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineGridView } from "react-icons/md";

const Sidebar = ({ isOpen }) => {
  return (
    <div>
      <div className={`sidebar ${isOpen ? "active" : ""}`}>
        <Link to="/">
          {" "}
          <MdOutlineGridView style={{ fontSize: "22px" }} />
          &nbsp; Dashboard
        </Link>
        <Link to="/products">Products</Link>
        <Link to="/inventory">Inventory</Link>
      </div>
    </div>
  );
};

export default Sidebar;
