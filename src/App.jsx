import { Routes, Route, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Footer from "./components/Footer";
import About from "./components/About";
import Contact from "./components/Contact";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ErrorPage from "./components/ErrorPage";
import Tasks from "./components/Tasks";
import Dashboard from "./components/Dashboard";
import Alert from "./components/Alert";
import { useSelector } from "react-redux";

function App() {
  const theme = useSelector((state) => state.theme);
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")) || "");
  const navigate = useNavigate();

  const handleTokenLogin = (token) => {
    setToken(token);
    localStorage.setItem("token", JSON.stringify(token));
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-base text-body">
      <Alert />
      <Navbar token={token} handleLogout={handleLogout} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup handleTokenLogin={handleTokenLogin} />} />
          <Route path="/login" element={<Login handleTokenLogin={handleTokenLogin} />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
