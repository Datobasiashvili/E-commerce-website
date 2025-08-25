import LoadingPage from "./Loadingpage";
import Header from "./header";
import HeroSection from "./HeroSection";
import SpecialBanner from "./SpecialBanner";
import DetailedProduct from "./DetailedProduct";
import { addProductToCart } from "../../../server/utils/cartAPI";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

// Using useContext to get the user authentication data from login and signup pages.
import { useContext, useState } from "react";
import { UserContext } from "./App";

export default function Home({ data, chunkArray }) {
  const { user, isAuthenticated } = useContext(UserContext);
  console.log(`Is user authenticated?: ${isAuthenticated}`);
  const productChunks = chunkArray(data, 5);
  const navigate = useNavigate();

  const handleAddProduct = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await addProductToCart(product);
      if (response.status === 200) {
        console.log(response.data.message);
        console.log(response.data.cart);
      }
    } catch (err) {
      console.error(`Error during adding the product: ${err}`);
    }
  };

  if (data.length === 0) return <LoadingPage />;

  return (
    <>
      <div className="home-container">
        <Header />
        <HeroSection />
        <p id="span-title">You might need</p>

        {productChunks.map((chunk, rowIndex) => (
          <div key={rowIndex}>
            <div className="product-row">
              {chunk.map((product) => (
                <div className="product-card" key={product.id} onClick={() => navigate(`/products/${product.id}`)}>
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="product-image"
                  />
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-price">{product.price}$</p>
                  <button
                    className="add-btn"
                    disabled={!isAuthenticated}
                    onClick={(e) => handleAddProduct(e, product)}
                  >
                    +
                  </button>
                </div>
              ))}
            </div>

            {rowIndex === 1 && <DetailedProduct product={data[11]} />}
            {rowIndex === 3 && <SpecialBanner />}
          </div>
        ))}
      </div>
    </>
  );
}
