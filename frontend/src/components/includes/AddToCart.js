import React, { useState } from "react";
import useHttp from "../../http/useHttp";
import "../../css/addtocart.css";

const AddToCart = ({ id }) => {
  // console.log("Product ID:", id);
  const [productId, setProductId] = useState(id);
  // console.log("Add to Cart:", productId);
  const { isLoading: loading, error: err, sendRequest } = useHttp();
  const [csrfToken, setCsrfToken] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const csrfRes = await fetch("http://localhost:5000/csrf-token", {
        credentials: "include",
      });
      const { csrfToken } = await csrfRes.json();
      setCsrfToken(csrfToken);

      const response = await fetch("http://localhost:5000/shop/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ productId: productId }),
      });

      const data = await response.json().catch(() => ({}));
      console.log("Response from server:", data);
      console.log("Product added to cart successfully");
      return;
    } catch (error) {
      console.error("Error submitting form", error);
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <button className="btn-addtocart btn" type="submit">
        Add to Cart
      </button>
      {/* <input type="hidden" name="productId" value={id} /> */}
    </form>
  );
};

export default AddToCart;
