import LoadingPage from "./Loadingpage";
import Header from "./header";
import HeroSection from "./HeroSection";
import "../styles/home.css";

export default function Home({ data, chunkArray }) {
  const productChunks = chunkArray(data, 5);

  if (data.length === 0) return <LoadingPage />;

  return (
    <>
      <div className="home-container">
        <Header />
        <HeroSection />
        <p id="span-title">You might need</p>
        {productChunks.map((chunk, rowIndex) => (
          <div className="product-row" key={rowIndex}>
            {chunk.map((product) => (
              <div className="product-card" key={product.id}>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="product-image"
                />
                <h3 className="product-title">{product.title}</h3>
                <p className="category">{product.category}</p>
                <p className="product-price">{product.price}$</p>
                <button className="add-btn">+</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
