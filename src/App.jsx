import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import Dashboard from "./Pages/Dashboard";
import Inventory from "./Pages/Inventory";
import Login from "./Pages/Login";
import "./App.css";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Router>
      <div className="App">
        {!isLogin ? (
          <Routes>
            <Route path="*" element={<Login onLoginSuccess={setIsLogin} />} />
          </Routes>
        ) : (
          <>
            <Navbar toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isOpen} />
            <main className="main-content-container">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
              </Routes>
            </main>
          </>
        )}
      </div>
    </Router>
  );
}
export default App;
