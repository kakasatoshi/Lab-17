import React, { useEffect, useState } from "react";
import "../../css/forms.css";
import useCsrfToken from "../../http/useCsrfToken";
const ProductForm = ({
  editing = false,
  product = {},
  validationErrors = [],
  errorMessage = "",
}) => {
  const [title, setTitle] = useState(product?.title ?? "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [image, setImage] = useState(null);
  const [csrfToken, setCsrfToken] = useState();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch("http://localhost:5000/csrf-token", {
          credentials: "include",
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error("CSRF token fetch error:", error);
      }
    };
    fetchCsrfToken();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("description", description);
    if (image) formData.append("image", image);
    if (editing) formData.append("productId", product._id);
    formData.append("_csrf", csrfToken);

    const url = editing
      ? "http://localhost:5000/admin/edit-product"
      : "http://localhost:5000/admin/add-product";

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
        credentials: "include", // Quan trọng nếu server yêu cầu cookie
      });

      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <main>
      {errorMessage && (
        <div className="user-message user-message--error">{errorMessage}</div>
      )}
      <form
        className="product-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="form-control">
          <label htmlFor="title">Title</label>
          <input
            className={
              validationErrors.some((e) => e.param === "title") ? "invalid" : ""
            }
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleFileChange}
          />
        </div>
        <div className="form-control">
          <label htmlFor="price">Price</label>
          <input
            className={
              validationErrors.some((e) => e.param === "price") ? "invalid" : ""
            }
            type="number"
            name="price"
            id="price"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label htmlFor="description">Description</label>
          <textarea
            className={
              validationErrors.some((e) => e.param === "description")
                ? "invalid"
                : ""
            }
            name="description"
            id="description"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        {editing && (
          <input type="hidden" name="productId" value={product._id} />
        )}
        <input type="hidden" name="_csrf" value={csrfToken} />
        <button className="btn" type="submit">
          {editing ? "Update Product" : "Add Product"}
        </button>
      </form>
    </main>
  );
};

export default ProductForm;
