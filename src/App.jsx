import React, { useState } from 'react';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import Dashboard from './Pages/Dashboard';
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
        <Dashboard />
      </main>
    </div>
    
  );
}
export default App;
