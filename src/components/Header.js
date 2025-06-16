import React from "react";
import { useNavigate } from "react-router-dom";
import "./../css/header.css"; // style file for header

function Header() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className="app-header">
      <div className="logo" onClick={handleLogoClick}>
        <img src="verdox/logo.svg" alt="Logo" />
      </div>
    </header>
  );
}

export default Header;
