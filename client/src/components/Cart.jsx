import { useState, useEffect, useContext } from "react";
import { UserContext } from "./App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import {
  addProductToCart,
  deleteProductFromCart,
  decreaseCartProductQuantity,
} from  "../api/cartAPI";
import LoadingPage from "./Loadingpage";
import "../styles/cart.css";

export default function Cart() {
  const [cartProducts, setCartProducts] = useState([]);
  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const getCart = async () => {
    try {
      const response = await axios.get(
        "https://e-commerce-website-47sr.onrender.com/api/cart/products",
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setCartProducts(() => response.data.cartProducts);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setCartProducts([]);
    }
  };

  //Fetching data from the cart/products whenevr a new produt is being added to the cart.
  const handleAddCartProduct = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await addProductToCart(product);
      if (response.status === 200) {
        console.log(response.data.message);
        getCart();
      }
    } catch (err) {
      console.error(`Error during adding the product: ${err}`);
    }
  };

  const handleDeleteCartProduct = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await deleteProductFromCart(product);
      if (response.status === 200) {
        console.log(response.data.message);
        getCart();
      }
    } catch (err) {
      console.error(`Error during deleting the product from cart: ${err}`);
    }
  };

  const handleDecreaseProductQuantity = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await decreaseCartProductQuantity(productId);
      if (response.status === 200) {
        getCart();
      }
    } catch (err) {
      console.error(
        `Error during decreasing the product's quantity from the cart: ${err}`
      );
    }
  };

  useEffect(() => {
    if (user && user._id) {
      getCart();
    } else {
      setCartProducts([]);
    }
  }, [user]);

  if (!user || !user._id) {
    return <LoadingPage />;
  }

  return (
    <>
      <Header />
      <div className="cart-container">
        <div className="cart-header">
          <h2>Your Shopping Cart</h2>
          <div className="cart-summary">
            {cartProducts.length > 0 && (
              <p>
                Total Items:{" "}
                {cartProducts.reduce(
                  (total, product) => total + product.quantity,
                  0
                )}
              </p>
            )}
          </div>
        </div>

        {cartProducts.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <p>Your cart is empty</p>
            <button
              className="continue-shopping-btn"
              onClick={() => navigate("/home")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <ul className="cart-items-list">
              {cartProducts.map((product, index) => (
                <li key={index} className="cart-item" onClick={() => navigate(`/products/${product._id}`)}>
                  <div className="cart-product-image-container">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="cart-product-image"
                    />
                  </div>
                  <div className="product-details">
                    <h3 className="product-name">{product.title}</h3>
                    {product.warrantyInformation && (
                      <p className="product-description">
                        Premium quality product with{" "}
                        {product.warrantyInformation}
                      </p>
                    )}
                    <div className="product-meta">
                      <span className="product-price">${product.price}</span>
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn"
                          onClick={(e) =>
                            handleDecreaseProductQuantity(e, product._id)
                          }
                        >
                          -
                        </button>
                        <span className="quantity">{product.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={(e) => handleAddCartProduct(e, product)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    className="remove-item-btn"
                    onClick={(e) => handleDeleteCartProduct(e, product)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#b23b3bff"
                    >
                      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-footer">
              <div className="cart-totals">
                <div className="subtotal">
                  <span>Subtotal:</span>
                  <span>
                    $
                    {cartProducts
                      .reduce(
                        (total, product) =>
                          total + product.price * product.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
                <div className="shipping">
                  <span>Shipping:</span>
                  <span>$5.99</span>
                </div>
                <div className="total">
                  <span>Total:</span>
                  <span>
                    $
                    {(
                      cartProducts.reduce(
                        (total, product) =>
                          total + product.price * product.quantity,
                        0
                      ) + 5.99
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <button className="checkout-btn">Proceed to Checkout</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
