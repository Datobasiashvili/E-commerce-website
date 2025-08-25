import axios from "axios";

export const addProductToCart = async (product) => {
  return await axios.post(
    "http://localhost:5000/api/cart/add",
    { product },
    { withCredentials: true }
  );
};
