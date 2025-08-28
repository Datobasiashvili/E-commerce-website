import LoadingPage from "./Loadingpage";
import Header from "./header";
import HeroSection from "./HeroSection";
import SpecialBanner from "./SpecialBanner";
import DetailedProduct from "./DetailedProduct";
import { addProductToCart } from "../../../server/utils/cartAPI";
import { useNavigate } from "react-router-dom";
import { useProducts } from "./ProductContext";
import "../styles/home.css";

// Using useContext to get the user authentication data from login and signup pages.
import { useContext } from "react";
import { UserContext } from "./App";

export default function Home() {
  const { productData: products = [] } = useProducts() || {};
  const { isAuthenticated } = useContext(UserContext);
  console.log(`Is user authenticated?: ${isAuthenticated}`);

  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };


  const productChunks = chunkArray(products, 5);
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

  if (products.length === 0) return <LoadingPage />;

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
                <div className="product-card" key={product.id} onClick={() => navigate(`/products/${product._id}`)}>
                  <img
                    src={product.images[0] || product.thumbnail}
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

            {rowIndex === 1 && <DetailedProduct product={products[11]} />}
            {rowIndex === 3 && <SpecialBanner />}
          </div>
        ))}
      </div>
    </>
  );
}
