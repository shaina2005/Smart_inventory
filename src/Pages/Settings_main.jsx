import React, { useEffect } from "react";
import { LuUserRoundPen } from "react-icons/lu";
import { FiBell } from "react-icons/fi";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { IoMoonOutline } from "react-icons/io5";
import { MdOutlineFileUpload } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import ToggleButton from "../Components/ToggleButton";
import Profile from "../assets/profile_img.webp";
import { useState } from "react";
import axios from "axios";

function Settings_main({
  handleLogout,
  notifications,
  setNotifications,
  dnd,
  setDnd,
}) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpForm, setHelpForm] = useState({
    title: "",
    description: "",
    email: "",
    screenshots: null,
  });

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
          path: "",
          icon: IoMdHelpCircleOutline,
          label: "Help",
          action: () => setIsHelpOpen(true),
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
  const [result, setResult] = useState(null);
  const helpSubmit = async (e) => {
    e.preventDefault();
    try {
      const helpSend = await axios.post("http://localhost:5000/help", {
        email: helpForm.email,
        title: helpForm.title,
        description: helpForm.description,
        screenshots: helpForm.screenshots,
      });
      setResult(helpSend.data);
    } catch (error) {
      console.log("Error " + error.message);
    }
  };

  useEffect(() => {
    if (result) {
      setTimeout(() => {
        setResult(null);
      }, 5000);
    }
  }, [result]);
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
      {isHelpOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setIsHelpOpen(false)}>
              ×
            </button>
            <h3>Report a Problem</h3>
            {result && (
              <div
                style={{
                  color: result.color,
                  fontSize: "15px",
                  marginBottom: "5px",
                }}
              >
                {result.message}; 
              </div>
            )}
            <form onSubmit={helpSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                // value={helpForm.email}
                onChange={(e) =>
                  setHelpForm({ ...helpForm, email: e.target.value })
                }
                required
              />
              <input
                type="text"
                name="title"
                placeholder="Problem Title"
                // value={helpForm.title}
                onChange={(e) =>
                  setHelpForm({ ...helpForm, title: e.target.value })
                }
                required
              />

              <textarea
                name="description"
                placeholder="Describe the problem..."
                rows="4"
                cols="48"
                // value={helpForm.description}
                onChange={(e) =>
                  setHelpForm({ ...helpForm, description: e.target.value })
                }
                required
              />

              {/* File Upload Section */}
              <div className="file-upload">
                <input
                  type="file"
                  id="screenshotUpload"
                  name="screenshots"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }} // hide default button
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const fileNames = files.map((file) => file.name);
                    setHelpForm({ ...helpForm, screenshots: fileNames });
                  }}
                />

                {/* Custom styled button */}
                <label htmlFor="screenshotUpload" className="upload-btn">
                  <MdOutlineFileUpload size={20} /> Upload Screenshots
                </label>

                {/* Show file names if selected */}
                {helpForm.screenshots && (
                  <div className="file-names">
                    {helpForm.screenshots.map((file, i) => (
                      <p key={i}>{file}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Submit
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsHelpOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings_main;
