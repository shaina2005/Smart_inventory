import React from "react";
import { FiBell, FiBellOff, FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";
import Profile_image from "../assets/pcte_profile.png";
import Profile from "../Pages/Profile";

const Navbar = ({ toggleSidebar, notificationsOn, setNotificationsOn }) => {
  const handleBellClick = () => {
    setNotificationsOn(!notificationsOn);
  };
  return (
    <>
      <div className="navbar-container">
        <header className="navbar-modern">
          <button className="hamburger-N" onClick={toggleSidebar}>
            <FiMenu size={22} />
          </button>
          <div className="navbar-left"></div>

          <div className="navbar-right">
            {/* Bell Icon with Background */}
            <div className="icon-container" onClick={handleBellClick}>
              {notificationsOn ? (
                <FiBell size={18} title="Notifications On" />
              ) : (
                <FiBellOff size={18} title="Notifications Off" />
              )}
            </div>

            {/* User Profile with Background */}
            <Link to="/profile" className="navprofile-container">
              <img src={Profile_image} alt="User" />
              <span>PCTE</span>
            </Link>
          </div>
        </header>
      </div>
    </>
  );
};

export default Navbar;
