import React from "react";

const Navbar = ({ toggleSidebar }) => {
  return (
    <div>
      <header className="navbar">
        <button className="hamburger" onClick={toggleSidebar}>
          ☰
        </button> 
        <div className="nav-text">Inventory Management System</div>
      </header>
    </div>
  );
};

export default Navbar;
