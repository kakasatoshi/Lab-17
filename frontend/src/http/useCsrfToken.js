import { useState, useEffect } from "react";
import axios from "axios";

const useCsrfToken = (csrfEndpoint) => {
  const [csrfToken, setCsrfToken] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(csrfEndpoint, {
          withCredentials: true,
        });
        setCsrfToken(response.data.csrfToken);
      } catch (err) {
        console.error("Failed to fetch CSRF token:", err);
        setError(err);
      }
    };

    fetchCsrfToken();
  }, [csrfEndpoint]);

  return { csrfToken, error };
};

export default useCsrfToken;
