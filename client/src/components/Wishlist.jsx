import Header from "./Header";
import { useState, useEffect, useContext } from "react";
import { useProducts } from "./ProductContext";
import { UserContext } from "./App";
import { useNavigate } from "react-router-dom";
import { removeFromWishlist } from "../api/wishlistAPI";
import { addProductToCart } from "../api/cartAPI";
import axios from "axios";
import "../styles/wishlist.css";

export default function Wishlist() {
  const { user, isAuthenticated } = useContext(UserContext);
  const [productIds, setProductIds] = useState([]);
  const productsContext = useProducts();
  const products = productsContext?.productData || [];
  const navigate = useNavigate();

  // Redirect if user not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signup");
    }
  }, [isAuthenticated, navigate]);

  // Fetch wishlist IDs
  const getWishlist = async () => {
    try {
      const response = await axios.get(
        "https://e-commerce-website-47sr.onrender.com/api/wishlist",
        { withCredentials: true }
      );

      if (response.status === 200) {
        setProductIds(response.data.wishlistIds);
        console.log("WISHLIST IDS:", response.data.wishlistIds);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setProductIds([]);
    }
  };

  // Delete from wishlist
  const handleDelete = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await removeFromWishlist(productId);
      if (response.status === 200) {
        console.log(response.data.message);
        setProductIds((prev) => prev.filter((id) => id !== productId)); 
      }
    } catch (err) {
      console.error(`Error during deleting product from wishlist: ${err}`);
    }
  };

  // Add to cart
  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await addProductToCart(product);
      if (response.status === 200) {
        console.log("Added to cart:", response.data.message);
      }
    } catch (err) {
      console.error(`Error adding product to cart: ${err}`);
    }
  };

  // Get wishlist on mount
  useEffect(() => {
    getWishlist();
  }, []);

  // Filter products using wishlist IDs
  const wishlistProducts = products.filter((p) => productIds?.includes(p._id));

  return (
    <>
      <Header />
      <div className="wishlist-container">
        <h1>Your Wishlist, {user?.name}!</h1>

        {wishlistProducts.length === 0 ? (
          <p>Your wishlist is empty 😢</p>
        ) : (
          <div className="wishlist-grid">
            {wishlistProducts.map((product) => (
              <div key={product._id} className="wishlist-item">
                <img src={product.images[0]} alt={product.title} />
                <div className="wishlist-info">
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <p>${product.price}</p>
                </div>
                <div className="wishlist-actions">
                  <button onClick={(e) => handleDelete(e, product._id)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#000000"
                    >
                      <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                    </svg>
                  </button>
                  <button onClick={(e) => handleAddToCart(e, product)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
