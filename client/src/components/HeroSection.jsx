import React, { useState } from "react";
import "../styles/heroSection.css"; // Import the CSS file

const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="hero-container">
      <div className="hero-card">
        {/* Background pattern overlay */}
        <div className="background-pattern">
          <div className="circle-1"></div>
          <div className="circle-2"></div>
          <div className="circle-3"></div>
        </div>

        <div className="hero-content">
          {/* Left content */}
          <div className="left-content">
            <h1 className="hero-title">
              Premium products
              <br />
              delivered fast
            </h1>
            <p className="hero-description">
              Discover our curated collection of premium goods with same-day
              delivery to your doorstep.
            </p>
            <button
              className={`hero-button ${isHovered ? "hero-button-hover" : ""}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Explore Now
            </button>
          </div>

          {/* Right content - Shopping bag with items */}
          <div className="right-content">
            <div className="bag-container">
              {/* Shopping bag */}
              <div className="shopping-bag">
                {/* Bag handles */}
                <div className="handle-1"></div>
                <div className="handle-2"></div>

                <div className="cart-icon">
                  <svg
                    className="cart-svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </div>
              </div>

              <div className="item-1"></div>
              <div className="item-2"></div>
              <div className="item-3"></div>
              <div className="item-4"></div>
              <div className="item-5"></div>
              <div className="item-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
