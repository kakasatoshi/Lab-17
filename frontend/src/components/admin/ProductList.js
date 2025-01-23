import React, { useState, useEffect } from "react";
import ProductForm from "./ProductForm";

const ProductPage = ({ productId, editing }) => {
  const [product, setProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const csrfToken = "your_csrf_token"; // Get this from your backend or context

  useEffect(() => {
    if (editing) {
      // Fetch product details if editing
      fetch(`/api/products/${productId}`)
        .then((res) => res.json())
        .then((data) => setProduct(data.product))
        .catch((err) => setErrorMessage("Error loading product."));
    }
  }, [editing, productId]);

  const handleSubmit = (formData) => {
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    const url = editing
      ? `http://localhost:5000/admin/edit-product`
      : "http://localhost:5000/admin/add-product";

    fetch(url, {
      method: "POST",
      body: formDataToSend,
      headers: {
        "CSRF-Token": csrfToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.errors) {
          setValidationErrors(data.errors);
        } else {
          // Redirect or update UI on success
        }
      })
      .catch((err) => setErrorMessage("Error submitting form."));
  };

  return (
    <div>
      {product && (
        <ProductForm
          product={product}
          editing={editing}
          errorMessage={errorMessage}
          validationErrors={validationErrors}
          csrfToken={csrfToken}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default ProductPage;
