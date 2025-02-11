import React, { useEffect, useState } from "react";
import "../../css/forms.css";
import { useNavigate, useLocation } from "react-router-dom";

const ProductForm = () => {
  const location = useLocation();
  const { editing, product } = location.state || {
    editing: false,
    product: [],
  };
  const [title, setTitle] = useState(product?.title ?? "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [image, setImage] = useState(null);
  const [csrfToken, setCsrfToken] = useState();
  const [validationErrors, setValidationErrors] = useState([]);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      setPreview(URL.createObjectURL(file));
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
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        setTitle("");
        setPrice("");
        setDescription("");
        setImage(null);
        setPreview("");
        setValidationErrors([]);
        setError("");
        alert("Product saved successfully!");
        navigate("/admin/ProductList"); // Chuyển đến trang quản lý sản phẩm
        return;
      }

      console.log("Success:", data);

      if (!data.success) {
        if (data.validationErrors) {
          setValidationErrors(data.validationErrors); // Lưu lỗi vào state
        }
        setError(data.message || "Something went wrong!");
        throw new Error(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <main>
      {/* {validationErrors.length > 0 && (
        <div className="user-message user-message--error">
          {validationErrors.map((err, index) => (
            <p key={index}>
              {err.path}: {err.msg}
            </p>
          ))}
        </div>
      )} */}
      {error.length > 0 && (
        <div className="user-message user-message--error">{error}</div>
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
              validationErrors.some((e) => e.path === "title") ? "invalid" : ""
            }
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {validationErrors
            .filter((e) => e.path === "title")
            .map((e, index) => (
              <div key={index} className="error-message">
                {e.msg}
              </div>
            ))}
        </div>

        <div className="form-control">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleFileChange}
          />
          {preview && <img src={preview} alt="Preview" width="200" />}
        </div>

        <div className="form-control">
          <label htmlFor="price">Price</label>
          <input
            className={
              validationErrors.some((e) => e.path === "price") ? "invalid" : ""
            }
            type="number"
            name="price"
            id="price"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {validationErrors
            .filter((e) => e.path === "price")
            .map((e, index) => (
              <div key={index} className="error-message">
                {e.msg}
              </div>
            ))}
        </div>

        <div className="form-control">
          <label htmlFor="description">Description</label>
          <textarea
            className={
              validationErrors.some((e) => e.path === "description")
                ? "invalid"
                : ""
            }
            name="description"
            id="description"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {validationErrors
            .filter((e) => e.path === "description")
            .map((e, index) => (
              <div key={index} className="error-message">
                {e.msg}
              </div>
            ))}
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
