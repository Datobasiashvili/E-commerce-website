import React from "react";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingPage from "./Loadingpage";

import { addToWishlist } from "../api/wishlistAPI";

import { useCart } from "../../hooks/useCart";

import axios from "axios";
import GoBackBtn from "./GoBackBtn";
import { UserContext } from "./App";
import "../styles/product.css";

export default function Product() {
  const { isAuthenticated } = useContext(UserContext);
  const { productId } = useParams();
  const [product, setProduct] = useState([]);
  const [imgThumbnail, setImgThumbnail] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  const { handleAddToCart, cartMessage, cartMessageType } = useCart();
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
      })
      .catch((err) => console.error("Error:", err));
  }, [productId]);


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/products/${productId}/reviews`,
          { withCredentials: true }
        );
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [productId]);

  // const handleAddProduct = async (e, product) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   const result = await handleAddToCart(product);

  //   setMessage(result.data.message);
  //   setMessageType(result.success ? "success" : "error");

  //   setTimeout(() => {
  //     const el = document.querySelector(".sp-message");
  //     if (el) el.classList.add("fade-out");
  //   }, 3000);

  //   setTimeout(() => setMessage(""), 3500);
  // };


  const handleAddToWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await addToWishlist(productId);
      if (response.status === 200) {
        setMessage(response.data.message);
        setMessageType("success");
        console.log(response.data.message);
      }
    } catch (err) {
      setMessage("Failed to add product to wishlist");
      setMessageType("error");
      console.error(`Error during adding the product: ${err}`);
    }
  };

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
        console.log("Review added successfully");
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
          <h1 className="sp-product-title">{product.title}</h1>
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
          {product.category !== "groceries" && product.rating && (
            <p className="sp-product-rating">Rating: {product.rating} ⭐</p>
          )}
          {product.price !== undefined && (
            <p className="sp-product-price">${product.price}</p>
          )}
          {product.description && (
            <p className="sp-product-description-text">{product.description}</p>
          )}

          {/* Display the message */}
          {cartMessage && (
            <p
              className={
                cartMessageType === "success" ? "sp-message" : "sp-err-message"
              }
            >
              {cartMessage}
            </p>
          )}

          <div className="sp-buttons">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if(isAuthenticated){
                  handleAddToCart(product)
                } else{
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
                if (isAuthenticated) {
                  handleAddToWishlist(e, product._id);
                } else {
                  handleNavigate(e);
                }
              }}
            >
              Add to wishlist
            </button>
          </div>
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
      </div>
    </>
  );
}
