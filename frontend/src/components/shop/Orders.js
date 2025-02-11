import React, { useEffect, useState, useCallback } from "react";
import useHttp from "../../http/useHttp";
import useCsrfToken from "../../http/useCsrfToken";

const Orders = () => {
  const { isLoading, error, sendRequest } = useHttp();
  const { csrfToken, error: csrfError } = useCsrfToken();
  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(() => {
    sendRequest(
      {
        url: "http://localhost:5000/shop/orders",
        method: "GET",
        headers: { Authorization: `Bearer ${csrfToken}` },
      },
      (data) => {
        setOrders(data.orders);
      }
    );
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSubmit = async (id) => {
    try {
      // Lấy CSRF token trước
      const csrfRes = await fetch("http://localhost:5000/csrf-token", {
        credentials: "include",
      });
      const { csrfToken } = await csrfRes.json();

      // Gửi request signup với CSRF token
      const response = await fetch(`http://localhost:5000/shop/orders/${id}`, {
        method: "GET",
        headers: {
          "CSRF-Token": csrfToken,
        },
        credentials: "include",
      });

      const data = await response.blob();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.errorMessage || "Something went wrong!");
      }

      alert("Signup successful!");

      // ✅ Điều hướng sang trang đăng nhập sau khi đăng ký thành công
    } catch (err) {
      // setErrorMessage(err.message);
    }
  };

  return (
    <div>
      <h1>Orders</h1>
      {error && <p className="error">Error: {error}</p>}
      {csrfError && <p className="error">CSRF Error: {csrfError}</p>}
      {isLoading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <h2>No orders found!</h2>
      ) : (
        <ul className="orders">
          {orders.map((order) => (
            <li className="orders__item" key={order._id}>
              <h4>Order - #{order._id} </h4>{" "}
              <a href={`http://localhost:5000/shop/orders/${order._id}`}>
                Invoice
              </a>
              {/* <button className="btn" onClick={() => handleSubmit(order._id)}>
                Invoice
              </button> */}
              <ul className="orders__products">
                {order.products.map((p, index) => (
                  <li className="orders__products-item" key={index}>
                    {p.product.title} ({p.quantity})
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
