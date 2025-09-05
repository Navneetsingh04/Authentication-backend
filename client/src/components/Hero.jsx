import React, { useContext } from "react";
import "../styles/Hero.css";
import { Context } from "../main";
import { ShieldUser } from "lucide-react";

const Hero = () => {
  const { user } = useContext(Context);
  return (
    <>
      <div className="hero-section">
        <ShieldUser className="hero-Image"/>
        <h4>Hello, {user ? user.name : "Developer"}</h4>
        <h1>Welcome to MERN Authentication</h1>
        <p>
          This project provides complete authentication using the MERN stack with OTP verification via Twilio and email verification via Nodemailer.
        </p>
      </div>
    </>
  );
};

export default Hero;
