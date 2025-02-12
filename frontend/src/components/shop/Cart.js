import React, { useState, useEffect } from "react";
import useHttp from "../../http/useHttp";
import { useNavigate } from "react-router-dom";
import "../../css/cart.css";
import useCsrfToken from "../../http/useCsrfToken";

const Cart = () => {
  const navigate = useNavigate();
  const { isLoading, error, sendRequest } = useHttp();
  const [carts, setCarts] = useState({ products: [] }); // Cấu trúc giỏ hàng { products: [...] }
  const [errorMessage, setErrorMessage] = useState("");
  const { csrfToken, errortoken } = useCsrfToken();
  const [load, setLoad] = useState(false);

  // 🛠 Lấy CSRF Token khi component mount

  // 🛠 Lấy giỏ hàng khi component mount (sau khi có CSRF Token)
  useEffect(() => {
    // if (!csrfToken) return; // Chỉ gọi API nếu có CSRF Token

    const fetchCart = async () => {
      try {
        const response = await fetch("http://localhost:5000/shop/cart", {
          credentials: "include",
        });
        // setErrorMessage(response, "error");
        // console.log(response, "response");
        if (response.status === 401) throw new Error("Vui lòng đăng nhập!");

        const productArr = await response.json();
        // console.log(productArr);

        if (!productArr.products) {
          throw new Error("Dữ liệu giỏ hàng không hợp lệ!");
        }

        setCarts(productArr);
        // console.log(productArr);
      } catch (error) {
        // console.error("Lỗi:", error);
        setErrorMessage(error.message);
      }
    };

    fetchCart();
  }, []); // Gọi lại khi có CSRF Token
  // console.log(carts);
  // 🛠 Xử lý xóa sản phẩm
  const deleteItemHandler = async (productId) => {
    console.log(productId, "productId");
    try {
      const response = await fetch(
        "http://localhost:5000/shop/cartDeleteItem",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
          },
          body: JSON.stringify({ productId: productId }),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data) {
        // window.location.reload();
        // console.log(carts);
        setCarts((prevCarts) => ({
          ...prevCarts,
          products: prevCarts.products.filter(
            (p) => p.productId._id !== productId
          ),
        }));
        // console.log(carts);
      }

      // setLoad(!load);

      if (!response.ok) throw new Error("Lỗi khi xóa sản phẩm!");
    } catch (error) {
      console.error(error);
      setErrorMessage("Không thể xóa sản phẩm!");
    }
  };

  // 🛠 Xử lý đặt hàng
  const onOrderNow = async () => {
    try {
      const response = await fetch("http://localhost:5000/shop/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        credentials: "include",
      });
      const data = await response.json();
      console.log(data, "data");

      // if (!response.ok) throw new Error("Lỗi khi đặt hàng!");

      navigate("/shop/orders");
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      setErrorMessage("Không thể đặt hàng!");
    }
  };

  return (
    <div>
      <main>
        {isLoading && <p>Loading...</p>}
        {errorMessage && <div className="error-box">{errorMessage}</div>}

        {carts.products.length > 0 ? (
          <>
            <ul className="cart__item-list">
              {carts.products.map((product) => (
                <li key={product._id} className="cart__item">
                  <h1>{product.productId.title}</h1>

                  <h2>Quantity: {product.quantity}</h2>

                  <button
                    className="btn danger"
                    onClick={() => deleteItemHandler(product.productId._id)}
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
        )}
      </main>
    </div>
  );
};

export default Cart;
