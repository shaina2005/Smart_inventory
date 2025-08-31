import React from "react";
import { FaUserPen } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
import { IoIosColorPalette } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { IoMoon } from "react-icons/io5";
import { Link } from "react-router-dom";

import Profile from "../assets/profile_img.webp";

function Settings_main() {
  const boxes = [
    {
      path: "/profile",
      icon: FaUserPen,
      label: "Profile",
    },
    {
      path: "/notification",
      icon: IoNotifications,
      label: "Notifications",
    },
    {
      path: "/theme",
      icon: IoIosColorPalette,
      label: "Theme",
    },
    {
      path: "/dnd",
      icon: IoMoon,
      label: "Do Not Disturb",
    },
    {
      path: "/logout",
      icon: IoMdLogOut,
      label: "Logout",
    },
  ];
  return (
    <div>
      <div className="settings-container">
        <div className="profilebox-container">
          <div className="leftbox">
            <div className="imagebox">
              <img src={Profile} alt="profile" />
            </div>
            <div className="profilebox-text">
              <h4>PCTE</h4>
              <h6 style={{ fontSize: "12px", color: "#949393ff" }}>Admin</h6>
            </div>
          </div>
          <div className="rightbox"></div>
        </div>

        {/* boxex  */}
        <div className="boxes">
          {boxes.map((item) => (
            <Link to={item.path} className="box">
              <div className="h">
                <item.icon size={18} />
                {item.label}
              </div>
              <div className="arrow"> &gt;</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Settings_main;
