import React, { useState } from 'react';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import './App.css';

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
      </main>
    </div>
    
  );
}
export default App;
