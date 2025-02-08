import { useState, useEffect } from "react";

const useCsrfToken = () => {
  const [csrfToken, setCsrfToken] = useState("");
  const [error, setError] = useState(null);

  

  return { csrfToken, error };
};

export default useCsrfToken;
