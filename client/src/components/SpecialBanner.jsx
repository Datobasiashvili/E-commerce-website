import "../styles/specialBanner.css";

export default function SpecialBanner() {
  return (
    <div className="banner-container">
      <div className="banner-content">
        <h1 className="banner-title">Limited Time Offer!</h1>
        <p className="banner-description">
          Get exclusive discounts on selected products. Don't miss out!
        </p> 
        <button className="banner-button">Shop Now</button>
      </div>
      <div className="banner-image">
        <img 
          src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
          alt="Special offer on electronics and accessories" 
        />
      </div>
    </div>
  );
};

