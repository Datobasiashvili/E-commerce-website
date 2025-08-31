import axios from "axios";

export const addToWishlist = async (productId) => {
  return await axios.post(
    "https://e-commerce-website-47sr.onrender.com/api/wishlist",
    { productId },
    { withCredentials: true }
  );
};
