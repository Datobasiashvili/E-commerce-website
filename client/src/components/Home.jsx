import { useContext, useState, useEffect } from "react";
import { useProducts } from "./ProductContext";
import { UserContext } from "./App";
import axios from "axios";
import { addProductToCart, decreaseCartProductQuantity } from "../api/cartAPI";
import { addToWishlist } from "../api/wishlistAPI";

import LoadingPage from "./Loadingpage";
import Header from "./Header";
import HeroSection from "./HeroSection";
import SpecialBanner from "./SpecialBanner";
import DetailedProduct from "./DetailedProduct";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  const productsContext = useProducts();
  const products = productsContext?.productData || [];
  const [cartProducts, setCartProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const { isAuthenticated } = useContext(UserContext);
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

  const getWishlist = async () => {
    try {
      const response = await axios.get(
        "https://e-commerce-website-47sr.onrender.com/api/wishlist",
        { withCredentials: true }
      );
      if (response.status === 200) {
        setWishlistIds(response.data.wishlistIds || []);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setWishlistIds([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getCart();
      getWishlist();
    } else {
      setCartProducts([]);
      setWishlistIds([]);
    }
  }, [isAuthenticated]);

  const handleAddProduct = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await addProductToCart(product);
      if (response.status === 200) {
        getCart();
      }
    } catch (err) {
      console.error(`Error during adding the product: ${err}`);
    }
  };

  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});

  // Chunk each category into rows of 5
  const categoryChunks = {};
  for (const category in groupedProducts) {
    categoryChunks[category] = chunkArray(groupedProducts[category], 5);
  }

  //Changing cart product's quantity from the home page.
  const handleAddCartProduct = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await addProductToCart(product);
      if (response.status === 200) {
        getCart();
      }
    } catch (err) {
      console.error(`Error during adding the product: ${err}`);
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

  const getProductQuantity = (productId) => {
    const item = cartProducts?.find((p) => p._id === productId);
    return item ? item.quantity : 0;
  };

  const handleAddToWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await addToWishlist(productId);
      if (response.status === 200) {
        setWishlistIds((prev) => [...prev, productId]);
        console.log(response.data.message);
      }
    } catch (err) {
      console.error(`Error during adding the product: ${err}`);
    }
  };

  const handleNavigate = (e) => {
    e.stopPropagation();
    e.preventDefault();

    navigate("/signup");
  };

  if (products.length === 0) return <LoadingPage />;

  return (
    <div className="home-container">
      <Header />
      <HeroSection />

      {Object.entries(categoryChunks).map(([category, rows]) => (
        <div className={`category-${category}`} key={category}>
          <h2 className="category-title">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h2>

          {rows.map((row, rowIndex) => (
            <div key={rowIndex}>
              <div className="product-row">
                {row.map((product) => (
                  <div
                    className="product-card"
                    key={product._id}
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    <button
                      onClick={(e) => {
                        isAuthenticated ? handleAddToWishlist(e, product._id) : handleNavigate(e);
                      }}
                      className={`wishlist-btn ${
                        wishlistIds.includes(product._id)
                          ? "wishlist-active"
                          : ""
                      }`}
                      disabled={wishlistIds.includes(product._id)}
                    >
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
                    <img
                      src={product.images[0] || product.thumbnail}
                      alt={product.title}
                      className="product-image"
                    />
                    <h3 className="product-title">{product.title}</h3>
                    <p className="product-price">{product.price}$</p>

                    {getProductQuantity(product._id) === 0 ? (
                      <button
                        className="add-btn"
                        onClick={(e) => {
                          if (isAuthenticated) {
                            handleAddProduct(e, product);
                          } else {
                            handleNavigate(e);
                          }
                        }}
                      >
                        +
                      </button>
                    ) : (
                      <div className="home-quantity-controls">
                        <button
                          className="increase-quantity-btn"
                          onClick={(e) => handleAddCartProduct(e, product)}
                        >
                          +
                        </button>
                        <span id="home-product-quantity">
                          {getProductQuantity(product._id)}
                        </span>
                        <button
                          className="decrease-quantity-btn"
                          onClick={(e) =>
                            handleDecreaseProductQuantity(e, product._id)
                          }
                        >
                          -
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {rowIndex === 1 && groupedProducts[category][11] && (
                <DetailedProduct product={groupedProducts[category][11]} />
              )}
              {rowIndex === 3 && <SpecialBanner />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
