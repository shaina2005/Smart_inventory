import React from "react";
import { useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdOutlineGridView } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import { FaChartLine, FaChartBar, FaCog } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const sidebarRef = useRef();
  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <MdOutlineGridView size={20} />,
    },
    { path: "/inventory", label: "Inventory", icon: <FaChartLine size={20} /> },
    {
      path: "/reports",
      label: "Reports & Analysis",
      icon: <FaChartBar size={20} />,
    },
    {
      path: "/indent",
      label: "Indent Request",
      icon: <FaClipboardList size={20} />,
    },
    {
      path: "/settings",
      label: "Settings",
      icon: <FaCog size={20} />,
      extraPath: "/profile",
    },
  ];
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (isOpen) toggleSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);
  return (
    <div ref={sidebarRef} className={`sidebar-modern ${isOpen ? "open" : ""}`}>
      <div className="sidebar-logo">
        <div className="hamburger" onClick={toggleSidebar}>
          <FiMenu size={25} />
        </div>
        <p>StockWise</p>
      </div>

      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={
              location.pathname === item.path ||
              (item.extraPath && item.extraPath.includes(location.pathname))
                ? "active"
                : ""
            }
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
