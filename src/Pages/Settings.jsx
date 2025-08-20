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
            <div className="profile-details">
              <h3>Profile Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Name :</span>
                  <span className="value">PCTE</span>
                </div>
                <div className="detail-item">
                  <span className="label">Role :</span>
                  <span className="value">Admin</span>
                </div>
                <div className="detail-item">
                  <span className="label">Email :</span>
                  <span className="value">pcte123@gmail.com</span>
                </div>
                <div className="detail-item">
                  <span className="label">Phone :</span>
                  <span className="value">1234567890</span>
                </div>
                <div className="detail-item">
                  <span className="label">Gender :</span>
                  <span className="value">Male</span>
                </div>
                <div className="detail-item">
                  <span className="label">Location :</span>
                  <span className="value">India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
