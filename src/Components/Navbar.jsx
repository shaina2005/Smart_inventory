import React from "react";

const Navbar = ({ toggleSidebar }) => {
  return (
    <div>
      <header className="navbar">
        <button className="hamburger text-left" onClick={toggleSidebar} >
          ☰
        </button> 
        <div className="nav-text">StockWise</div>
      </header>
    </div>
  );
};

export default Navbar;
