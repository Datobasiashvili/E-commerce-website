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
    if (!isAuthenticated && !user) {
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
        setProductIds((prev) => prev.filter((id) => id.toString() !== productId.toString()));
      }
    } catch (err) {
      console.error(`Error during deleting product from wishlist: ${err}`);
      setProductIds([])
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
        {wishlistProducts.length === 0 ? (
          <h1>Your wishlist is empty {user?.name}</h1>
        ) : (
          <>
            <h1>Your Wishlist, {user?.name}!</h1>
            <div className="wishlist-grid">
              {wishlistProducts.map((product) => (
                <div key={product._id} className="wishlist-item" onClick={() => navigate(`/products/${product._id}`)}>
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
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                      </svg>
                    </button>
                    <button onClick={(e) => handleAddToCart(e, product)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
