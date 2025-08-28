import "../styles/detailedProduct.css";

export default function DetailedProduct({ product }) {
  return (
    <div className="dp-wrapper">
      <div className="dp-container">
        <div className="dp-promo-section">
          <div className="dp-discount-tag">70% OFF</div>
        </div>

        <div className="dp-content">
          <div className="dp-image-slider">
            {/* Image slider would go here */}
            <img
              src={product.images[0]}
              alt={product.title}
              className="dp-product-image"
            />
          </div>

          <div className="dp-details">
            <div className="dp-brand-header">
              <h1>{product.brand}</h1>
            </div>

            <h2 className="dp-title">{product.title}</h2>

            <div className="dp-rating">
              <span>{product.rating}</span>
              <span>reviews ({product.reviews.length})</span>
            </div>

            <div className="dp-price-section">
              <span className="dp-price">{product.price}$</span>
              <div className="dp-stock">Stock: {product.stock}</div>
            </div>

            <div className="dp-actions">
              <button className="dp-cart-btn">
                Add to cart{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#FFFFFF"
                >
                  <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
                </svg>
              </button>
              <button className="dp-wishlist-btn">ADD TO WISHLIST</button>
            </div>

            <div className="dp-meta">
              <p>Brand: {product.brand}</p>
              <p>Width: {product.dimensions.width}</p>
              <p>Height: {product.dimensions.height}</p>
              <p>Depth: {product.dimensions.depth}</p>
            </div>

            <div className="dp-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
