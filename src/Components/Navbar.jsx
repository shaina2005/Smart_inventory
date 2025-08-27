import React from "react";
import { FiSearch, FiBell ,FiMenu} from "react-icons/fi";

const Navbar = ({ toggleSidebar }) => {
  return (
    <>
    <div className="navbar-container">
    <header className="navbar-modern">
      <button className="hamburger-N" onClick={toggleSidebar}>
        <FiMenu size={22} />
      </button>
      <div className="navbar-left"></div>

      <div className="navbar-right">
        {/* Search Box */}
        <div className="search-box">
          <FiSearch size={18} />
          <input type="text" placeholder="Search" />
        </div>

        {/* Bell Icon with Background */}
        <div className="icon-container">
          <FiBell size={18} />
        </div>

        {/* User Profile with Background */}
        <div className="profile-container">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png"
            alt="User"
          />
          <span>PCTE</span>
        </div>
      </div>
    </header>
    </div>
    </>
  );
};

export default Navbar;