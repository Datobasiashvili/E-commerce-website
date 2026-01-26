import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const addProductToCart = async (productId) => {
  return await axios.post(
    `${API_URL}/cart`,
    { productId },
    { withCredentials: true }
  );
};

export const deleteProductFromCart = async (productId) => {
  return await axios.delete(
    `${API_URL}/cart`,
    {
      data: { productId },
      withCredentials: true,
    });
};

export const decreaseCartProductQuantity = async (productId) => {
  return await axios.patch(
    `${API_URL}/cart`,
    { productId },
    { withCredentials: true }
  );
};
