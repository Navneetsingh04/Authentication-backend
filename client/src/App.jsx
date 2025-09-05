import React, { useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { Toaster } from "react-hot-toast";
import { axiosInstance } from "./lib/axios";
import { Context } from "./main";
import OtpVerification from "./pages/OtpVerification";

const App = () => {
  const { setIsAuthenticated, setUser } = useContext(Context);

  useEffect(() => {
    const getUser = async () => {
      await axiosInstance
        .get("/user/me")
        .then((res) => {
          setUser(res.data.user);
          setIsAuthenticated(true);
        })
        .catch((err) => {
          setUser(null);
          setIsAuthenticated(false);
        });
    };
    getUser();
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/otp-verification/:email/:phone"
            element={<OtpVerification />}
          />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
        </Routes>
      </Router>
      <Toaster
        toastOptions={{
          duration: 4000,
          style: {
            border: "1px solid #1a73e8", 
            background: "#e8f0fe",
            color: "#1a73e8", 
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
          },
        }}
      />
    </>
  );
};

export default App;
