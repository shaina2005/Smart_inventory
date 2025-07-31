import React, { useState } from "react";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import "./App.css";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="App">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isOpen} />
      <main className="main-content-container">
        <h1>Inventory Management Dashboard</h1>
        <button className="btn btn-primary">Click Me</button>
        <div className="container mt-5">
          <h1>Hello, Bootstrap + React!</h1>
        </div>
      </main>
    </div>
  );
}
export default App;
