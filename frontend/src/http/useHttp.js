import { useState } from "react";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(null);

  const sendRequest = async (requestConfig, applyData) => {
    setIsLoading(true);
    setErr(null);

    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method || "GET",
        headers: {
          "Content-Type": "application/json", // Mặc định Content-Type
          ...(requestConfig.headers || {}),  // Thêm các header khác
        },
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
        credentials: "include", // Đảm bảo gửi cookie session
      });

      if (!response.ok) {
        // Ném lỗi nếu request thất bại
        const errorData = await response.json();
        throw new Error(errorData.message || "Request failed");
      }

      // Parse JSON response
      const data = await response.json();
      applyData(data);
    } catch (error) {
      // Cập nhật lỗi
      setErr(error.message || "Something went wrong!");
    }

    setIsLoading(false);
  };

  return {
    isLoading,
    error: err,
    sendRequest,
  };
};

export default useHttp;
