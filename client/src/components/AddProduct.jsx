import { useState } from "react";
import axios from "axios";
import "../styles/addProduct.css";
import GoBackBtn from "./GoBackBtn";
import { useNavigate } from "react-router-dom";
import { useProducts } from "./ProductContext";

export default function AddProduct() {
  const [preview, setPreview] = useState(false);
  const [imgThumbnail, setImgThumbnail] = useState(null);
  const [form, setForm] = useState({
    title: "",
    price: "",
    brand: "",
    category: "",
    description: "",
    thumbnail: "",
    images: [""],
  });
  const { setProductData } = useProducts();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    setForm((prev) => {
      const newImages = [...prev.images];
      newImages[index] = value;
      return { ...prev, images: newImages };
    });
  };

  const addImageField = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        images: form.images.filter(Boolean),
      };

      const response = await axios.post(
        `${API_URL}/products`,
        payload,
        { withCredentials: true }
      );

      if (response.status === 201) {
        //On succesfull post request we automatically update this state variable so when the user is navigated to the home page, the home page won't need a reload to display all the data, including the new added product.
        setProductData((prev) => [...prev, response.data]);
        navigate("/home");
        console.log("Product Added Successfully!");
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.msg || "Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  return !preview ? (
    <>
      <GoBackBtn />
      <div className="add-product-page">
        <div
          className={
            error ? "err-add-product-container" : "add-product-container"
          }
        >
          <h2 className="form-title">Add a New Product</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="add-product-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title">Product Title</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Enter product title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  placeholder="0.00"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="brand">Brand/Author</label>
                <input
                  id="brand"
                  type="text"
                  name="brand"
                  placeholder="Enter brand name"
                  value={form.brand}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="category-select"
                >
                  <option value="" id="category-selection">
                    Select a Category
                  </option>
                  <option value="electronics">Electronics</option>
                  <option value="books">Books</option>
                  <option value="groceries">Groceries</option>
                  <option value="sports">Sports</option>
                  <option value="beauty">Beauty</option>
                  <option value="furniture">Furniture</option>
                  <option value="fragrances">Fragrances</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter product description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows="4"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="thumbnail">Thumbnail URL</label>
                <input
                  id="thumbnail"
                  type="text"
                  name="thumbnail"
                  placeholder="https://example.com/image.jpg"
                  value={form.thumbnail}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Additional Images (optional)</label>

                <div className="image-inputs-container">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="image-input-group">
                      <input
                        type="text"
                        placeholder={`Image URL #${idx + 1}`}
                        value={img}
                        onChange={(e) => handleImageChange(idx, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addImageField}
                  className="add-image-btn"
                >
                  + Add another image
                </button>
              </div>
            </div>

            <button
              type="button"
              className="preview-btn"
              onClick={() => {
                // simple validation for required fields
                if (
                  !form.title ||
                  !form.price ||
                  !form.category ||
                  !form.description ||
                  !form.thumbnail
                ) {
                  setError(
                    "Please fill in all required fields before previewing!"
                  );
                  return;
                }
                setImgThumbnail(form.thumbnail);
                setPreview(true);
                setError(null);
              }}
            >
              See Preview
            </button>
          </form>
        </div>
      </div>
    </>
  ) : (
    <>
      <button className="preview-back-btn" onClick={() => setPreview(false)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="18px"
          fill="#000000ff"
        >
          <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
        </svg>
        Go back
      </button>
      <div className="preview-product-container">
        <div className="preview-product-images">
          <img
            src={imgThumbnail || form.thumbnail}
            alt={form.title}
            className="preview-main-image"
          />
          <div className="preview-thumbnail-row">
            {Array.isArray(form?.images) &&
              form.images.length > 1 &&
              form.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${form.title} ${index}`}
                  className="preview-thumbnail"
                  onClick={() => setImgThumbnail(img)}
                />
              ))}
          </div>
        </div>

        <div className="preview-product-info">
          <h1 className="preview-product-title">{form.title}</h1>
          {form.brand &&
            (form.category === "books" ? (
              <p className="preview-product-brand">Author: {form.brand}</p>
            ) : (
              <p className="preview-product-brand">Brand: {form.brand}</p>
            ))}
          {form.category && (
            <p className="preview-product-category">
              Category: {form.category}
            </p>
          )}
          {form.sellerName && (
            <p className="preview-product-sellerName">Seller: {form.sellerName}</p>
          )}
          {form.category !== "groceries" && form.rating && (
            <p className="preview-product-rating">Rating: {form.rating} ⭐</p>
          )}
          {form.price !== undefined && (
            <p className="preview-product-price">${form.price}</p>
          )}
          {form.description && (
            <p className="preview-product-description-text">
              {form.description}
            </p>
          )}

          <div className="preview-buttons">
            <button>
              Add to cart{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#FFFFFF"
              >
                <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
              </svg>
            </button>
            <button>Add to wishlist</button>
          </div>
        </div>
      </div>

      <div className="preview-action-btn">
        <button type="button" onClick={handleSubmit}>
          Add Product
        </button>
      </div>
    </>
  );
}
