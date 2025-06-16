import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./../css/header.css";

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="logo" onClick={handleLogoClick}>
        <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt="Logo" />
      </div>

      {isAuthenticated && (
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      )}
    </header>
  );
}

export default Header;
