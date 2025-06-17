import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Welcome from "./components/Welcome";
import Quiz from "./components/Quiz";
import UsersList from "./components/UsersList";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import AddStudentId from "./components/AddStudentId";

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/login" element={<Login />} />
            {/* ✅ Only protect this one */}
            <Route 
              path="/userslist" 
              element={
                <PrivateRoute>
                  <UsersList />
                </PrivateRoute>
              } 
            />
            <Route
              path="/addstudentid"
              element={
                <PrivateRoute>
                  <AddStudentId />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
