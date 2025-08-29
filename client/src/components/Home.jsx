import LoadingPage from "./Loadingpage";
import Header from "./header";
import HeroSection from "./HeroSection";
import SpecialBanner from "./SpecialBanner";
import DetailedProduct from "./DetailedProduct";
import axios from "axios";
import {
  addProductToCart,
  decreaseCartProductQuantity,
} from "../api/cartAPI";
import { useNavigate } from "react-router-dom";
import { useProducts } from "./ProductContext";
import "../styles/home.css";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "./App";

export default function Home() {
  const productsContext = useProducts();
  const products = productsContext?.productData || []; 
  const [cartProducts, setCartProducts] = useState();
  const { isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();

  const getCart = async () => {
    try {
      const response = await axios.get(
        "https://e-commerce-website-47sr.onrender.com/api/products",
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

  useEffect(() => {
    if (isAuthenticated) getCart();
    else setCartProducts([]);
  }, [isAuthenticated]);

  const handleAddProduct = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await addProductToCart(product);
      if (response.status === 200) {
        getCart()
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

              {rowIndex === 1 && (
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
