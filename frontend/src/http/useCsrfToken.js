import { useState, useEffect } from "react";
import axios from "axios";

const useCsrfToken = () => {
  const [csrfToken, setCsrfToken] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get("http://localhost:5000/csrf-token", {
          withCredentials: true,
        });
        setCsrfToken(response.data.csrfToken);
      } catch (err) {
        console.error("Failed to fetch CSRF token:", err);
        setError(err);
      }
    };

    fetchCsrfToken();
  }, []);

  return { csrfToken, error };
};

export default useCsrfToken;
