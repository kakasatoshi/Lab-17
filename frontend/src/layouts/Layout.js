import { Outlet, useLocation } from "react-router-dom";
import css from "./layOut.module.css";
import Header from "../components/includes/Header";
import React, { useState, useEffect } from "react";
import axios from "axios";
import useCsrfToken from "../http/useCsrfToken";
import End from "../components/includes/End";
import { CsrfProvider } from "../components/context/CsrfContext.js"; // Import context

const Layout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { csrfToken, error } = useCsrfToken();
  console.log("csrfToken:", csrfToken);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/status", {
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

  const location = useLocation();

  return (
    <CsrfProvider csrfToken={csrfToken}>
      <div>
        <Header
          path={location.pathname}
          isAuthenticated={isAuthenticated}
          csrfToken={csrfToken}
        />
        <div className={css.layout}>
          <Outlet />
        </div>
        <End />
        <footer>Footer</footer>
      </div>
    </CsrfProvider>
  );
};

export default Layout;
