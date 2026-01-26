import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const addToWishlist = async (productId) => {
  return await axios.post(
    `${API_URL}/wishlist`,
    { productId },
    { withCredentials: true }
  );
};

export const removeFromWishlist = async (productId) => {
  return await axios.delete(
    `${API_URL}/wishlist/${productId}`,
    {
      withCredentials: true,
    });

}