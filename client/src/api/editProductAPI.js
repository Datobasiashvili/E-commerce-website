import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const editProduct = async (productId, formData) => {
  const { title, price, description } = formData;
  return await axios.patch(
    `${API_URL}/products/${productId}`,
    { title, price, description },
    { withCredentials: true }
  );
};

export const deleteProduct = async (productId) => {
    return await axios.delete(
        `${API_URL}/products/${productId}`,
        { withCredentials: true}
    );
}