import { useProducts } from "./ProductContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/searchbar.css";

export default function Searchbar() {
  const { productData: products = [] } = useProducts() || {};
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const filteredProducts =
    searchQuery && products.length
      ? products.filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    // Add a small delay to allow clicks on the results
    setTimeout(() => setIsFocused(false), 200);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search for products..."
        autoComplete="off"
        onChange={handleSearch}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={searchQuery}
        id="searchbar"
      />

      {isFocused && searchQuery && (
        <div className="search-results">
          {filteredProducts.length > 0 ? (
            <>
              <div className="results-header">
                <h3>Search Results</h3>
                <span className="results-count">
                  {filteredProducts.length} products found
                </span>
              </div>
              <div className="results-list">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="filteredProduct-result"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    <div className="filteredProduct-image">
                      <img src={product.thumbnail} alt={product.title} />
                    </div>
                    <div className="filteredProduct-details">
                      <h4 className="filteredProduct-title">{product.title}</h4>
                      <p className="filteredProduct-category">
                        {product.brand}
                      </p>
                      <div className="filteredProduct-price">
                        ${product.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-results">
              <p>No products found for "{searchQuery}"</p>
              <span>Try different keywords</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
