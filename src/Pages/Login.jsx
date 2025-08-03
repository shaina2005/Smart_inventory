import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import {}

function Login({onLoginSuccess}) {
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = axios.post("http://localhost:5000/api/auth/login", {
        role,
        password,
      });

      if ((await res).data.success) {
        onLoginSuccess(true);
        Navigate("/dashboard")
      } else {
        alert("failed. Try again");
      }
    } catch (error) {
     if(error.response && error.response.status===401)
     {
      alert(error.response.data.message)
     }
     else{
      alert("Pta nhi kya hogya")
     }
    }
  };
  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="title">StockWise</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>User</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">-Select role-</option>
              <option value="admin">Admin</option>
              <option value="staff">staff</option>
            </select>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="login-button">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
