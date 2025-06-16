import React from "react";
import "./../css/footer.css";

function Footer() {
  return (
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} Veridox. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
