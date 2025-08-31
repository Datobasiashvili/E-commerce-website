import axios from "axios";

export const addToWishlist = async (productId) => {
  return await axios.post(
    "http://localhost:5000/api/wishlist",
    { productId },
    { withCredentials: true }
  );
};
