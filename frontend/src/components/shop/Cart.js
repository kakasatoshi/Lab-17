import React, { useState, useEffect } from "react";
import useHttp from "../../http/useHttp";
import { useNavigate } from "react-router-dom";
import "../../css/cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { isLoading, error, sendRequest } = useHttp();
  const [carts, setCarts] = useState([]);
  const [show, setShow] = useState(false);
  const [csrfToken, setCsrfToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // 🛠 Lấy CSRF Token khi component mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const csrfRes = await fetch("http://localhost:5000/csrf-token", {
          credentials: "include",
        });
        const csrfData = await csrfRes.json();
        setCsrfToken(csrfData.csrfToken); // ✅ Lưu token vào state
        console.log("CSRF Token:", csrfData.csrfToken);
      } catch (error) {
        console.error("Lỗi lấy CSRF Token:", error);
      }
    };
    fetchCsrfToken();

    const fetchCart = async () => {
      try {
        const response = await fetch("http://localhost:5000/shop/cart", {
          method: "GET",
          credentials: "include", // 🔥 QUAN TRỌNG: Đảm bảo cookie session được gửi
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Cart data:", data);
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
      }
    };

    fetchCart();
  }, []);

  // 🛠 Lấy giỏ hàng khi component mount

  console.log(carts);

  // 🛠 Xử lý xóa sản phẩm
  const deleteItemHandler = async (productId) => {
    try {
      const response = await fetch(
        "http://localhost:5000/shop/cartDeleteItem",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken, // ✅ Đảm bảo token đã được set
          },
          body: JSON.stringify({ productId }),
        }
      );

      if (!response.ok) throw new Error("Lỗi khi xóa sản phẩm!");

      setCarts((prevCarts) => prevCarts.filter((p) => p._id !== productId)); // ✅ Cập nhật state
    } catch (error) {
      console.error(error);
      setErrorMessage("Không thể xóa sản phẩm!");
    }
  };

  // 🛠 Xử lý đặt hàng
  const onOrderNow = async () => {
    try {
      await fetch("http://localhost:5000/shop/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      navigate("/shop/orders");
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
    }
  };

  return (
    <div>
      <main>
        {isLoading && <p>Loading...</p>}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {/* {carts.length > 0 ? (
          <>
            <ul className="cart__item-list">
              {carts.map((product) => (
                <li key={product._id} className="cart__item">
                  <h1>{product.title}</h1>
                  <h2>Quantity: {product.quantity}</h2>
                  <button
                    className="btn danger"
                    onClick={() => deleteItemHandler(product._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <hr />
            <div className="centered">
              <button className="btn" onClick={onOrderNow}>
                Order Now!
              </button>
            </div>
          </>
        ) : (
          <h1>No Products in Cart!</h1>
        )} */}
      </main>
    </div>
  );
};

export default Cart;
