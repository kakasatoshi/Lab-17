import React, { useState } from 'react';

function Cart({ products, csrfToken, onDeleteItem, onOrderNow }) {
    return (
        <main>
            {products.length > 0 ? (
                <>
                    <ul className="cart__item-list">
                        {products.map((product) => (
                            <li key={product.productId._id} className="cart__item">
                                <h1>{product.productId.title}</h1>
                                <h2>Quantity: {product.quantity}</h2>
                                <form
                                    onSubmit={(e) => onDeleteItem(e, product.productId._id)}
                                    method="POST"
                                >
                                    <input type="hidden" name="productId" value={product.productId._id} />
                                    <input type="hidden" name="_csrf" value={csrfToken} />
                                    <button className="btn danger" type="submit">Delete</button>
                                </form>
                            </li>
                        ))}
                    </ul>
                    <hr />
                    <div className="centered">
                        <form onSubmit={onOrderNow} method="POST">
                            <input type="hidden" name="_csrf" value={csrfToken} />
                            <button type="submit" className="btn">Order Now!</button>
                        </form>
                    </div>
                </>
            ) : (
                <h1>No Products in Cart!</h1>
            )}
        </main>
    );
}

export default Cart;
