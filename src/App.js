import React from "react";
  import { HashRouter as Router, Routes, Route } from "react-router-dom";
  import Header from "./components/Header";
  import Footer from "./components/Footer";
  import Home from "./components/Home";
  import Welcome from "./components/Welcome";
  import Quiz from "./components/Quiz";

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
            {/* Add other routes here */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
