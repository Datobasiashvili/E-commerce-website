import "../styles/specialBanner.css";

export default function SpecialBanner() {
  return (
    <div className="special-banner">
      <div className="banner-content">
        <h2 className="banner-title">Limited Time Offer!</h2>
        <p className="banner-subtitle">
          Get exclusive discounts on selected products. Don’t miss out!
        </p>
        <button className="banner-button">Shop Now</button>
      </div>
      <div className="banner-image">
        <img
          src="https://images.unsplash.com/photo-1602524814020-6a7e102d657d?auto=format&fit=crop&w=600&q=80"
          alt="Special Offer"
        />
      </div>
    </div>
  );
}