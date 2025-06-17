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

  const handleAddStudentId = () => {
    navigate("/addstudentid");
  };

  const handleViewExamDetails = () => {
    navigate("/userslist");
  };

  return (
    <header className="app-header">
    <div className="logo" onClick={handleLogoClick}>
      <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt="Logo" />
    </div>

    {isAuthenticated && (
      <div className="header-right"> {/* update this class to match your CSS */}
        <button
          className="header-button add-student-id-button"  // add shared and specific classes
          onClick={handleAddStudentId}
        >
          Add Student ID
        </button>

        <button
          className="header-button view-exam-details-button"
          onClick={handleViewExamDetails}
        >
          View Exam Details
        </button>

        <button
          className="logout-button header-button"  // keep logout-button but also add shared header-button for styling consistency
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    )}
  </header>

  );
}

export default Header;
