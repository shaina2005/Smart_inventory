import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Splashscreen from "./Components/Splashscreen";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import Dashboard from "./Pages/Dashboard";
import Inventory from "./Pages/Inventory";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import Settings_main from "./Pages/Settings_main";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(
    sessionStorage.getItem("isLogin") === "true"
  ); // login state
  const [isOpen, setIsOpen] = useState(false);
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplash(false);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  if (splash) {
    return <Splashscreen />;
  }
  return (
    <Router>
      <div className="App">
        {!isLogin ? (
          <Routes>
            <Route
              path="*"
              element={
                <Login
                  onLoginSuccess={(success) => {
                    if (success) {
                      sessionStorage.setItem("isLogin", "true");
                      setIsLogin(true);
                    } else {
                      sessionStorage.removeItem("isLogin");
                      setIsLogin(false);
                    }
                  }}
                />
              }
            />
          </Routes>
        ) : (
          <>
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <Navbar toggleSidebar={toggleSidebar} />
            <main className="main-modern">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/profile" element={<Profile />} />
                <Route
                  path="/settings"
                  element={
                    <Settings_main
                      handleLogout={() => {
                        sessionStorage.removeItem("isLogin");
                        setIsLogin(false);
                      }}
                    />
                  }
                />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </main>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
