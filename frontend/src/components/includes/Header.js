import React from "react";

const Header = ({ path, isAuthenticated, csrfToken }) => {
  const handleLogout = (event) => {
    event.preventDefault();
    fetch("http://localhost:5000/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken, // Token lấy từ /csrf-token
      },
      credentials: "include", // Để gửi cookie cùng với yêu cầu
    })
      .then((response) => {
        if (response.ok) {
          // Chuyển hướng hoặc cập nhật trạng thái sau khi logout thành công
          window.location.href = "/";
        } else {
          console.error("Logout failed");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <>
      <div className="backdrop"></div>
      <header className="main-header">
        <button id="side-menu-toggle">Menu</button>
        <nav className="main-header__nav">
          <ul className="main-header__item-list">
            <li className="main-header__item">
              <a className={path === "/" ? "active" : ""} href="/">
                Shop
              </a>
            </li>
            <li className="main-header__item">
              <a
                className={path === "/shop/products" ? "active" : ""}
                href="/shop/products"
              >
                Products
              </a>
            </li>
            {isAuthenticated && (
              <>
                <li className="main-header__item">
                  <a
                    className={path === "/shop/cart" ? "active" : ""}
                    href="/shop/cart"
                  >
                    Cart
                  </a>
                </li>
                <li className="main-header__item">
                  <a
                    className={path === "/shop/orders" ? "active" : ""}
                    href="/shop/orders"
                  >
                    Orders
                  </a>
                </li>
                <li className="main-header__item">
                  <a
                    className={path === "/admin/AddProduct" ? "active" : ""}
                    href="/admin/AddProduct"
                  >
                    Add Product
                  </a>
                </li>
                <li className="main-header__item">
                  <a
                    className={path === "/admin/ProductList" ? "active" : ""}
                    href="/admin/ProductList"
                  >
                    Admin Products
                  </a>
                </li>
              </>
            )}
          </ul>
          <ul
            className="main-header__item-list"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginLeft: "auto",
            }}
          >
            {!isAuthenticated ? (
              <>
                <li className="main-header__item">
                  <a
                    className={path === "/login" ? "active" : ""}
                    href="/login"
                  >
                    Login
                  </a>
                </li>
                <li className="main-header__item">
                  <a
                    className={path === "/signup" ? "active" : ""}
                    href="/signup"
                  >
                    Signup
                  </a>
                </li>
              </>
            ) : (
              <li className="main-header__item">
                <form onSubmit={handleLogout}>
                  <input type="hidden" name="_csrf" value={csrfToken} />
                  <button type="submit">Logout</button>
                </form>
              </li>
            )}
          </ul>
        </nav>
      </header>

      <nav className="mobile-nav">
        <ul className="mobile-nav__item-list">
          <li className="mobile-nav__item">
            <a className={path === "/" ? "active" : ""} href="/">
              Shop
            </a>
          </li>
          <li className="mobile-nav__item">
            <a
              className={path === "/products" ? "active" : ""}
              href="/products"
            >
              Products
            </a>
          </li>
          {isAuthenticated && (
            <>
              <li className="mobile-nav__item">
                <a className={path === "/cart" ? "active" : ""} href="/cart">
                  Cart
                </a>
              </li>
              <li className="mobile-nav__item">
                <a
                  className={path === "/orders" ? "active" : ""}
                  href="/orders"
                >
                  Orders
                </a>
              </li>
              <li className="mobile-nav__item">
                <a
                  className={path === "/admin/add-product" ? "active" : ""}
                  href="/admin/add-product"
                >
                  Add Product
                </a>
              </li>
              <li className="mobile-nav__item">
                <a
                  className={path === "/admin/products" ? "active" : ""}
                  href="/admin/products"
                >
                  Admin Products
                </a>
              </li>
            </>
          )}
          {!isAuthenticated ? (
            <>
              <li className="mobile-nav__item">
                <a className={path === "/login" ? "active" : ""} href="/login">
                  Login
                </a>
              </li>
              <li className="mobile-nav__item">
                <a
                  className={path === "/signup" ? "active" : ""}
                  href="/signup"
                >
                  Signup
                </a>
              </li>
            </>
          ) : (
            <li className="mobile-nav__item">
              <form onSubmit={handleLogout}>
                <input type="hidden" name="_csrf" value={csrfToken} />
                <button type="submit">Logout</button>
              </form>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Header;
