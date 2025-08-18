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
              <span>({product.reviews.length} reviews)</span>
            </div>

            <div className="dp-price-section">
              <span className="dp-price">{product.price}$</span>
              <div className="dp-stock">Stock: {product.stock}</div>
            </div>

            <div className="dp-actions">
              <button className="dp-cart-btn">Add to cart</button>
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
