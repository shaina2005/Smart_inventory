import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdOutlineGridView } from "react-icons/md";
import { FaChartLine, FaChartBar, FaCog } from "react-icons/fa";
import { FiMenu} from "react-icons/fi";


const Sidebar = ({isOpen , toggleSidebar}) => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <MdOutlineGridView size={20} /> },
    { path: "/inventory", label: "Inventory", icon: <FaChartLine size={20} /> },
    { path: "/reports", label: "Reports & Analysis", icon: <FaChartBar size={20} /> },
    { path: "/settings", label: "Settings", icon: <FaCog size={20} /> }
  ];

  return (
    <>
    <div className={`sidebar-modern ${isOpen? "open ":" "}`}>
      <div className="sidebar-logo">
        <button className="hamburger" onClick={toggleSidebar}>
                <FiMenu size={22} />
              </button>
       StockWise
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

    
    </>
  );
};

export default Sidebar;
