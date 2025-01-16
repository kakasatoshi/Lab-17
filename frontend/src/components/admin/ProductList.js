import React from "react";
import { useNavigate } from "react-router-dom";

const ProductList = ({ products, csrfToken, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = (productId) => {
    fetch("/admin/delete-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ productId }),
    })
      .then((response) => {
        if (response.ok) {
          onDelete(productId); // Cập nhật danh sách sản phẩm sau khi xóa
        } else {
          throw new Error("Failed to delete product");
        }
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };

  if (products.length === 0) {
    return <h1>No Products Found!</h1>;
  }

  return (
    <main>
      <div className="grid">
        {products.map((product) => (
          <article className="card product-item" key={product._id}>
            <header className="card__header">
              <h1 className="product__title">{product.title}</h1>
            </header>
            <div className="card__image">
              <img src={`/${product.imageUrl}`} alt={product.title} />
            </div>
            <div className="card__content">
              <h2 className="product__price">${product.price}</h2>
              <p className="product__description">{product.description}</p>
            </div>
            <div className="card__actions">
              <button
                className="btn"
                onClick={() =>
                  navigate(`/admin/edit-product/${product._id}?edit=true`)
                }
              >
                Edit
              </button>
              <button className="btn" onClick={() => handleDelete(product._id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
};

export default ProductList;
