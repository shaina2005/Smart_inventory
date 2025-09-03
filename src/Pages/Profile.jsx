import React, { useState } from "react";
import { FiEdit2, FiSave, FiLogOut } from "react-icons/fi";
import profile from "../assets/profile_img.webp";
import "../Settings.css";
import "../App.css"

function Profile() {
  const initialProfile = {
    name: "PCTE",
    role: "Admin",
    email: "pcte123@gmail.com",
    phone: "1234567890",
    gender: "Male",
    location: "India",
  };

  const [profileData, setProfileData] = useState(initialProfile);
  const [profileImage, setProfileImage] = useState(profile);
  const [draft, setDraft] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };
  const handleEditToggle = () => {
    setStatusMessage("");

    if (isEditing) {
      setIsEditing(false); // Stop editing
    } else {
      setDraft(profileData); // Prepare draft for editing
      setIsEditing(true); // Start editing
    }
  };

  const validate = (values) => {
    const newErrors = {};

    if (!values.name || values.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(values.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!values.phone || !/^\+?\d{7,15}$/.test(values.phone)) {
      newErrors.phone = "Enter a valid phone number (7-15 digits).";
    }

    if (!values.location || values.location.trim().length < 2) {
      newErrors.location = "Location is required.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Check for validation errors
    const newErrors = validate(draft);
    setErrors(newErrors);

    // If there are errors, don't save
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Save the profile data
    setProfileData(draft);
    setIsEditing(false);
    setStatusMessage("Profile updated");

    // Clear the success message after 2 seconds
    setTimeout(() => setStatusMessage(""), 2000);
  };

  return (

    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-actions">
          <button
            type="button"
            className="btn ghost edit-btn"
            onClick={handleEditToggle}
          >
            {isEditing ? <FiSave size={16} /> : <FiEdit2 size={16} />}
            <span>{isEditing ? "Save" : "Edit"}</span>
          </button>
        </div>
      </div>

      <div className="columns">
        {/* Left column - Profile picture and name */}
        <div className="left">
          <div className="profile-image">
            <img src={profileImage} alt="Profile avatar" />
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            
              <FiEdit2
                size={25}
                className="edit-icon"
                onClick={() => document.getElementById("fileInput").click()}
              />
           
          </div>
          <div className="name-container">
            <div className="name">{profileData.name}</div>
            {/* <div className="role-subtitle">{profileData.role}</div> */}
          </div>
        </div>

        {/* Right column - Profile details or edit form */}
        <div className="right">
          <div className="profile-right">
            <h3>Profile Details</h3>

            {isEditing === false ? (
              // View mode - show profile details
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Name</span>
                  <span className="detail-value">{profileData.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Role</span>
                  <span className="detail-value">{profileData.role}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{profileData.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{profileData.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Gender</span>
                  <span className="detail-value">{profileData.gender}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">{profileData.location}</span>
                </div>
              </div>
            ) : (
              // Edit mode - show form
              <form onSubmit={handleSave}>
                <div className="details-grid">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={draft.name}
                      onChange={handleChange}
                      className={errors.name ? "input error" : "input"}
                    />
                    {errors.name && (
                      <div className="error-text">{errors.name}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={draft.email}
                      onChange={handleChange}
                      className={errors.email ? "input error" : "input"}
                    />
                    {errors.email && (
                      <div className="error-text">{errors.email}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={draft.phone}
                      onChange={handleChange}
                      className={errors.phone ? "input error" : "input"}
                    />
                    {errors.phone && (
                      <div className="error-text">{errors.phone}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={draft.gender}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={draft.location}
                      onChange={handleChange}
                      className={errors.location ? "input error" : "input"}
                    />
                    {errors.location && (
                      <div className="error-text">{errors.location}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <input
                      id="role"
                      name="role"
                      type="text"
                      value={draft.role}
                      disabled   
                      className="input"
                    />
                  </div>
                </div>

                <div className="actions-row">
                  <button type="submit" className="btn primary save-btn">
                    <FiSave size={16} />
                    <span>Save</span>
                  </button>
                  <button
                    type="button"
                    className="btn ghost"
                    onClick={handleEditToggle}
                  >
                    <span>Cancel</span>
                  </button>

                  {/* Show success message */}
                  {statusMessage && (
                    <div className="status-text">{statusMessage}</div>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>

  );
}

export default Profile;
