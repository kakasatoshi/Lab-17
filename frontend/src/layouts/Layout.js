import { Outlet } from "react-router-dom";
import Navbar from "../components/includes/Mynavbar";
import css from "./layOut.module.css";
import Header from "../components/includes/Header";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import useCsrfToken from "../http/useCsrfToken";

const Layout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { csrfToken, error } = useCsrfToken("http://localhost:5000/csrf-token");

  // Xác định trạng thái đăng nhập (giả định lấy từ API hoặc context)
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth/status", {
          withCredentials: true,
        });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Lấy path từ hook của react-router-dom
  const location = useLocation();

  return (
    <div>
      {/* <Navbar /> */}
      <Header
        path={location.pathname} // Lấy path hiện tại
        isAuthenticated={isAuthenticated} // Trạng thái đăng nhập
        csrfToken={csrfToken} // Token CSRF
      />
      <div className={css.layout}>
        <Outlet csrfToken={csrfToken} />
      </div>

      <footer>Footer</footer>
    </div>
  );
};

export default Layout;
