import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineGridView } from "react-icons/md";
import { FaChartLine } from "react-icons/fa6";


const Sidebar = ({ isOpen }) => {
  return (
    <div>
      <div className={`sidebar ${isOpen ? "active" : ""}`}>
        <Link to="/">
          {" "}
          <MdOutlineGridView style={{ fontSize: "22px" }} />
          &nbsp; Dashboard
        </Link>
        <Link to="/products"> 
         Products</Link>
        <Link to="/inventory"><FaChartLine style={{ fontSize: "22px" }}/>
       &nbsp; Inventory</Link>
      </div>
    </div>
  );
};

export default Sidebar;
