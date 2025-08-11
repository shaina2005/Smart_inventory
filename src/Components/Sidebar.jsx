import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdOutlineGridView } from "react-icons/md";
import { FaChartLine, FaUtensils, FaUsers, FaShoppingCart, FaShieldAlt, FaChartBar, FaCog } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <MdOutlineGridView size={20} /> },
    { path: "/inventory", label: "Inventory", icon: <FaChartLine size={20} /> },
    { path: "/reports", label: "Reports & Analysis", icon: <FaChartBar size={20} /> },
    { path: "/settings", label: "Settings", icon: <FaCog size={20} /> }
  ];

  return (
    <div className="sidebar-modern">
      <div className="sidebar-logo">
        <div className="logo-circle">StockWise</div>
      </div>
      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? "active" : ""}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
