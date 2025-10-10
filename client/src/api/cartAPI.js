import axios from "axios";

export const addProductToCart = async (product) => {
  return await axios.post(
    "https://e-commerce-website-47sr.onrender.com/api/cart/add",
    { product },
    { withCredentials: true }
  );
};

export const deleteProductFromCart = async (product) => {
  return await axios.delete("https://e-commerce-website-47sr.onrender.com/api/cart/delete", {
    data: { product },
    withCredentials: true,
  });
};

export const decreaseCartProductQuantity = async (productId) => {
  return await axios.patch(
    "https://e-commerce-website-47sr.onrender.com/api/cart/decrease",
    { productId },
    { withCredentials: true }
  );
};
