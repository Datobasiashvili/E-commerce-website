import Header from "./Header";
import { useEffect, useContext } from "react";
import { useWishlist } from "../../hooks/useWishlist";
import { useCart } from "../../hooks/useCart";
import { UserContext } from "./App";
import { useNavigate } from "react-router-dom";
import "../styles/wishlist.css";

export default function Wishlist() {
  const { user, isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();

  const { wishlistProducts, handleDeleteFromWishlist } = useWishlist();
  const { handleAddToCart } = useCart();

  useEffect(() => {
    if (!isAuthenticated && !user) {
      navigate("/signup");
    }
  }, [isAuthenticated, navigate]);

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
                    <button onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleDeleteFromWishlist(product._id);
                    }}>
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
                    <button onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleAddToCart(product);
                    }}>
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
