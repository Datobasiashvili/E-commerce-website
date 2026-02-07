import React from "react";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingPage from "./Loadingpage";

import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { useProducts } from "../../hooks/useProducts";

import axios from "axios";
import GoBackBtn from "./GoBackBtn";
import { UserContext } from "./App";
import "../styles/product.css";

export default function Product() {
  const { isAuthenticated, user } = useContext(UserContext);
  const { productId } = useParams();
  const [product, setProduct] = useState();
  const [imgThumbnail, setImgThumbnail] = useState(null);

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  const { handleAddToCart, cartMessage, cartMessageType } = useCart();
  const { handleAddToWishlist, wishlistMessage, wishlistMessageType } = useWishlist();
  const { handleEditProduct, handleDeleteProduct, editProductMessage, editProductMessageType } = useProducts();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(
        `${API_URL}/products/${productId}`
      )
      .then((res) => {
        setProduct(res.data);
        res.data.images[0] && setImgThumbnail(res.data.images[0]);
        setFormData({
          title: res.data.title,
          price: res.data.price,
          description: res.data.description
        })
      })
      .catch((err) => console.error("Error:", err));
  }, [productId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/products/${productId}/reviews`
        );
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleReviewSubmit = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/reviews/${productId}`,
        {
          comment,
          rating
        },
        { withCredentials: true }
      );
      if (response.status === 201) {
        const { review, avgRating, ratingCount } = response.data;

        setReviews((prev) => [review, ...prev]);

        setProduct((prev) => ({
          ...prev,
          rating: avgRating,
          ratingCount: ratingCount,
        }));

        setComment("");
        setRating(0);
      }
    } catch (err) {
      if (err.response) {
        console.error(err.response.data);
      } else if (err.request) {
        console.error(err.request);
      } else {
        console.error(err.message);
      }
    }
  };

  const handleNavigate = (e) => {
    e.stopPropagation();
    e.preventDefault();

    navigate("/signup");
  };

  if (!product) {
    return <LoadingPage />;
  }

  const isOwner = user && user._id === product.sellerId;

  return (
    <>
      <GoBackBtn />
      <div className="sp-product-container">
        <div className="sp-product-images">
          <img
            src={imgThumbnail}
            alt={product.title}
            className="sp-main-image"
          />
          <div className="sp-thumbnail-row">
            {Array.isArray(product?.images) &&
              product.images.length > 1 &&
              product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.title} ${index}`}
                  className="sp-thumbnail"
                  onClick={() => setImgThumbnail(img)}
                />
              ))}
          </div>
        </div>

        <div className="sp-product-info">
          {isEditing ? (
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="sp-product-title"
            />
          ) : (
            <h1 className="sp-product-title">{product.title}</h1>
          )}

          {product.brand &&
            (product.category === "books" ? (
              <p className="sp-product-brand">Author: {product.brand}</p>
            ) : (
              <p className="sp-product-brand">Brand: {product.brand}</p>
            ))}

          {product.category && (
            <p className="sp-product-category">Category: {product.category}</p>
          )}

          {product.sellerName && (
            <p className="sp-product-sellerName">
              Seller: {product.sellerName}
            </p>
          )}

          {product.category !== "groceries" && (
            <p className="sp-product-rating">⭐ {product.rating} ({product.ratingCount} {product.ratingCount === 1 ? "review" : "reviews"})</p>
          )}

          {isEditing ? (
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="sp-product-price"
            />
          ) : (
            product.price !== undefined && (
              <p className="sp-product-price">${product.price}</p>
            )
          )}

          {isEditing ? (
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })
              }
              className="sp-product-description-text"
            />
          ) : (
            product.description && (
              <p className="sp-product-description-text">{product.description}</p>
            )
          )}


          {/* Display the cart message, wishlist message or edit message */}
          {(cartMessage && (
            <p
              className={
                cartMessageType === "success" ? "sp-message" : "sp-err-message"
              }
            >
              {cartMessage}
            </p>
          )) || (wishlistMessage && (
            <p
              className={
                wishlistMessageType === "success"
                  ? "sp-message"
                  : wishlistMessageType === "info"
                    ? "sp-info-message"
                    : "sp-err-message"
              }
            >
              {wishlistMessage}
            </p>
          )) || (editProductMessage && (
            <p
              className={
                editProductMessageType === "success" ? "sp-message" : "sp-err-message"
              }
            >
              {editProductMessage}
            </p>
          ))}

          {!isOwner ? (
            <div className="sp-buttons">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  if (isAuthenticated) {
                    handleAddToCart(product)
                  } else {
                    handleNavigate(e);
                  }
                }}
              >
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
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  if (isAuthenticated) {
                    handleAddToWishlist(product._id);
                  } else {
                    handleNavigate(e);
                  }
                }}
              >
                Add to wishlist
              </button>
            </div>
          ) : (
            <div className="sp-buttons">
              {isEditing ? (
                <button className="sp-edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleEditProduct(productId, formData, setProduct, setIsEditing);
                  }}
                >Save product</button>
              ) : (
                <button className="sp-edit-btn" onClick={() => setIsEditing(true)}>Edit your product</button>
              )}

              <button className="delete-product-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleDeleteProduct(productId);
                }}
              >Delete product</button>
            </div>
          )}

        </div>

        {isAuthenticated ? (
          <div className="sp-reviews-section">
            <h2 className="sp-reviews-title">Customer Reviews</h2>

            <form className="sp-review-form" onSubmit={handleReviewSubmit}>
              <h3>Write a Review</h3>

              <textarea
                className="sp-comment-input"
                placeholder="Share your thoughts about this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />

              <div className="sp-rating-container">
                <div className="sp-star-rating">
                  {[5, 4, 3, 2, 1].map((value) => (
                    <React.Fragment key={value}>
                      <input
                        type="radio"
                        id={`star${value}`}
                        name="rating"
                        value={value}
                        checked={rating === value}
                        onChange={() => setRating(value)}
                        required
                      />
                      <label htmlFor={`star${value}`}>★</label>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <button type="submit" className="sp-review-submit-btn">
                Submit Review
              </button>
            </form>

          </div>
        ) : (
          <div className="sp-auth-required">
            <h1>Sign in to leave a review</h1>
            <p>Join the conversation and share your experience with this product</p>
            <button className="sp-login-btn" onClick={handleNavigate}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Sign In / Sign Up
            </button>
          </div>
        )}

        <div className="sp-reviews">
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="sp-review-container">
                <div className="sp-review-header">
                  <p className="sp-review-username">{review.username}</p>
                  <div className="sp-review-rating">
                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    <span>({review.rating}/5)</span>
                  </div>
                </div>
                <p className="sp-review-comment">{review.comment}</p>
                <p className="sp-review-date">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            ))
          ) : (
            <div className="sp-no-reviews">
              No reviews yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </div >
    </>
  );
}
