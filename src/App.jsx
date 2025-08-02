import React, { useState } from "react";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import Dashboard from "./Pages/Dashboard";
import Inventory from "./Pages/Inventory";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Router>
      <div className="App">
        <Navbar toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isOpen} />
        <main className="main-content-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/products" element={<Products />} /> */}
            <Route path="/inventory" element={<Inventory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App;
