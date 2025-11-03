import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/InventoryLogo copy.png";

function Login({ onLoginSuccess }) {
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://smart-inventory-mx5v.onrender.com/api/auth/login", {
        role,
        password,
      });

      if (res.data.success) {
        onLoginSuccess(true);
        localStorage.setItem("role", res.data.role);
        navigate("/dashboard");
      } else {
        onLoginSuccess(false);
        alert("Login failed. Try again");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong");
      }
    }
  };

  return (
    <div className="login-layout">
      {/* Left side branding */}
      <div className="login-left">
        <img src={Logo} alt="Smart Inventory Logo" className="brand-logo" />
        <h1>StockWise</h1>
        <p>Manage your stock efficiently with ease.</p>
      </div>

      {/* Right side login form */}
      <div className="login-right">
        <div className="login-box">
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to continue</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="login-btn">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
