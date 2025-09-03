import React from "react";
import { LuUserRoundPen } from "react-icons/lu";
import { FiBell } from "react-icons/fi";
import { HiOutlinePaintBrush } from "react-icons/hi2";
import { IoMdLogOut } from "react-icons/io";
import { IoMoonOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import ToggleButton from "../Components/Togglebutton";

import Profile from "../assets/profile_img.webp";

function Settings_main({handleLogout}) {
  const boxes = [
    {
      title: "Account settings",
      items: [
        {
          path: "/profile",
          icon: LuUserRoundPen,
          label: "Profile",
        },
        {
          path: "/notification",
          icon: FiBell,
          label: "Notifications",
        },
      ],
    },

    {
      title: "Preferences",
      items: [
        {
          path: "/theme",
          icon: HiOutlinePaintBrush,
          label: "Theme",
        },
        {
          path: "/dnd",
          icon: IoMoonOutline,
          label: "Do Not Disturb",
        },
      ],
    },
    {
      title: "General",
      items: [
        {
          path: "/logout",
          icon: IoMdLogOut,
          label: "Logout",
          action :handleLogout,
        },
      ],
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
          {boxes.map((section)=>(
            <div key={section.title}>
            <h5>{section.title}</h5>
            {section.items.map((item)=>(
              <Link to={item.path} key={item.path} className="box" onClick={item.action}>
                <div className="h">
                  <item.icon size={18}/>
                  {item.label}
                </div>
                <div className="arrow">&gt;</div>
              </Link> 
            ))}
            </div>  
          ))}
        </div>
      </div>
    </div>
  );
}

export default Settings_main;
