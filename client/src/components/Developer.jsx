import React from "react";
import "../styles/Developer.css";
import devloperImage from "../assets/profile.jpg";

const Developer = () => {
  return (
    <div className="devloper-page">
      <div className="devloper-card">
        <div className="devloper-image">
          <img src={devloperImage} alt="Developer" />
        </div>
        <div className="devloper-info">
          <h1>Navneet Singh</h1>
          <h4>Developer</h4>
          <p>
            Hello! I'm Navneet Singh, a passionate MERN stack developer with a strong focus on building scalable and robust applications. With experience in JavaScript, React, Node.js, Express, and MongoDB, I enjoy creating solutions that are efficient, reliable, and user-friendly.
          </p>
          <div className="social-links">
            <a
              href="https://github.com/Navneetsingh04"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/navneetsingh04/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://www.imnavneet.me/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Portfolio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Developer;
