import axios from "axios";

export const addProductToCart = async (product) => {
  return await axios.post(
    "http://localhost:5000/api/cart/add",
    { product },
    { withCredentials: true }
  );
};

export const deleteProductFromCart = async (product) => {
  return await axios.delete("http://localhost:5000/api/cart/delete", {
    data: { product },
    withCredentials: true,
  });
};

export const decreaseCartProductQuantity = async (productId) => {
  return await axios.patch(
    "http://localhost:5000/api/cart/decrease",
    { productId },
    { withCredentials: true }
  );
};
