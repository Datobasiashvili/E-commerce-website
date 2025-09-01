import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingPage from "./Loadingpage";
import { addProductToCart } from "../api/cartAPI";
import { addToWishlist } from "../api/wishlistAPI";
import axios from "axios";
import GoBackBtn from "./GoBackBtn";
import { UserContext } from "./App";
import "../styles/product.css";

export default function Product() {
  const [product, setProduct] = useState([]);
  const { isAuthenticated } = useContext(UserContext);
  const { productId } = useParams();
  const [imgThumbnail, setImgThumbnail] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `https://e-commerce-website-47sr.onrender.com/api/products/${productId}`
      )
      .then((res) => {
        setProduct(res.data);
        res.data.images[0] && setImgThumbnail(res.data.images[0]);
      })
      .catch((err) => console.error("Error:", err));
  }, [productId]);

  const handleAddProduct = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await addProductToCart(product);
      if (response.status === 200) {
        setMessage(response.data.message);
        setMessageType("success");

        // Fade out after 3 seconds
        setTimeout(() => {
          const messageElement = document.querySelector(".sp-message");
          if (messageElement) {
            messageElement.classList.add("fade-out");
          }
        }, 3000);

        // Remove message after fade-out transition (0.5s)
        setTimeout(() => setMessage(""), 3500);
      }
    } catch (err) {
      setMessage("Failed to add product");
      setMessageType("error");
      setTimeout(() => {
        const messageElement = document.querySelector(".sp-message");
        if (messageElement) messageElement.classList.add("fade-out");
      }, 3000);
      setTimeout(() => setMessage(""), 3500);
    }
  };

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
          {message && (
            <p
              className={
                messageType === "success" ? "sp-message" : "sp-err-message"
              }
            >
              {message}
            </p>
          )}

          <div className="sp-buttons">
            <button
              onClick={(e) => {
                if (isAuthenticated) {
                  handleAddProduct(e, product);
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
      </div>
    </>
  );
}
