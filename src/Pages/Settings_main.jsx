import React from "react";
import { LuUserRoundPen } from "react-icons/lu";
import { FiBell } from "react-icons/fi";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { IoMoonOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import ToggleButton from "../Components/ToggleButton";
import Profile from "../assets/profile_img.webp";
import { useState } from "react";

function Settings_main({
  handleLogout,
  notifications,
  setNotifications,
  dnd,
  setDnd,
}) {
  // const [notifications, setNotifications] = useState(true);
  // const [dnd, setDnd] = useState(false);
  const [theme, setTheme] = useState(false);
  const navigate = useNavigate();
  const boxes = [
    {
      title: "Account settings",
      items: [
        {
          path: "/profile",
          icon: LuUserRoundPen,
          label: "Profile",
        },
      ],
    },

    {
      title: "Preferences",
      items: [
        {
          // path: "/notification",
          type: "toggle",
          state: "notifications",
          icon: FiBell,
          label: "Notifications",
        },
        {
          // path: "/dnd",
          type: "toggle",
          state: "dnd",
          icon: IoMoonOutline,
          label: "Do Not Disturb",
        },
      ],
    },
    {
      title: "General",
      items: [
        {
          path: "/",
          icon: IoMdHelpCircleOutline,
          label: "Help",
        },
        {
          path: "/logout",
          icon: IoMdLogOut,
          label: "Logout",
          action: handleLogout,
        },
      ],
    },
  ];

  const handleToggle = (stateName) => {
    if (stateName === "notifications") {
      setNotifications(!notifications);
    }
    if (stateName === "theme") {
      setTheme(!theme);
    }
    if (stateName === "dnd") {
      setDnd(!dnd);
    }
  };
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
          {boxes.map((section) => (
            <div key={section.title}>
              <h5>{section.title}</h5>
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="box"
                  onClick={() => {
                    if (item.path) {
                      navigate(item.path);
                    }
                    if (item.action) {
                      item.action();
                    }
                  }}
                >
                  <div className="h">
                    <item.icon size={18} />
                    {item.label}
                  </div>

                  {/* toggle  */}
                  {item.type === "toggle" ? (
                    <ToggleButton
                      isOn={
                        item.state === "notifications"
                          ? notifications
                          : item.state === "theme"
                          ? theme
                          : dnd
                      }
                      onToggle={() => handleToggle(item.state)}
                    />
                  ) : (
                    <div className="arrow">&gt;</div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Settings_main;
