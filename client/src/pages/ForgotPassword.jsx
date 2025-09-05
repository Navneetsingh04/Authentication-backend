import React, { useContext, useState } from "react";
import "../styles/ForgotPassword.css";
import { Context } from "../main";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
  const { isAuthenticated } = useContext(Context);
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    await axiosInstance
      .post(
        "/user/password/reset",
        { email },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Password reset request failed. Please try again.");
      });
  };

  return (
    <>
      <div className="forgot-password-page">
        <div className="forgot-password-container">
          <h2>Forgot Password</h2>
          <p>Enter your email address to receive a password reset token.</p>
          <form
            onSubmit={handleForgotPassword}
            className="forgot-password-form"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="forgot-input"
            />
            <button type="submit" className="forgot-btn">
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
