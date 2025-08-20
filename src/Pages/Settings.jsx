import React from "react";
import profile from "../assets/profile_img.webp";
import "../Settings.css";
function Settings() {
  return (
    <>
      <div className="setting-container">
        <div className="setting-heading">My profile</div>
        <div className="columns">
          {/* column 1 */}
          <div className="left">
            <div className="profile-image">
              <img src={profile} alt="user name" />
            </div>
            <div className="name-container">
            <div className="name">PCTE</div>
            </div>
          </div>

          {/* column 2 */}
          <div className="right">
            Name: PCTE
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
