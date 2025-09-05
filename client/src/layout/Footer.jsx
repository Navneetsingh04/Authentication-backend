import React from "react";
import "../styles/Footer.css";
import { Link } from "react-router";
import { Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h2>MERN Authentication</h2>
          <p>
            Secure login, OTP verification, and email confirmation in one
            solution.
          </p>
        </div>
        <div className="footer-social">
          <h3>Follow Me</h3>
          <div className="social-icons">
            <Link
              to="https://www.linkedin.com/in/navneetsingh04/"
              target="_blank"
              className="social-link"
            >
              <Linkedin />
            </Link>
            <Link
              to="https://github.com/Navneetsingh04"
              target="_blank"
              className="social-link"
            >
              <Github />
            </Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} MERN Authentication. All Rights
          Reserved.
        </p>
        <p>Designed by Navneet Singh</p>
      </div>
    </footer>
  );
};

export default Footer;
