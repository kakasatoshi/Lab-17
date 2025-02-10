import React, { useState, useEffect } from 'react';
import "../../css/forms.css";

const ProductForm = ({ product, editing, errorMessage, validationErrors, csrfToken, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: product?.title || '',
        image: null,
        price: product?.price || '',
        description: product?.description || '',
        productId: product?._id || ''
    });

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div>
            <h1>{editing ? 'Edit Product' : 'Add Product'}</h1>
            {errorMessage && <div className="user-message user-message--error">{errorMessage}</div>}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-control">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={validationErrors?.some(e => e.param === 'title') ? 'invalid' : ''}
                    />
                </div>

                <div className="form-control">
                    <label htmlFor="image">Image</label>
                    <input
                        type="file"
                        name="image"
                        id="image"
                        onChange={handleChange}
                    />
                </div>

                <div className="form-control">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        className={validationErrors?.some(e => e.param === 'price') ? 'invalid' : ''}
                    />
                </div>

                <div className="form-control">
                    <label htmlFor="description">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        rows="5"
                        value={formData.description}
                        onChange={handleChange}
                        className={validationErrors?.some(e => e.param === 'description') ? 'invalid' : ''}
                    />
                </div>

                {editing && (
                    <input type="hidden" name="productId" value={formData.productId} />
                )}

                <input type="hidden" name="_csrf" value={csrfToken} />

                <button className="btn" type="submit">{editing ? 'Update Product' : 'Add Product'}</button>
            </form>
        </div>
    );
};

export default ProductForm;
