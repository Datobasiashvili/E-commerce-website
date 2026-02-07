import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const addReview = async (productId) => {
    return await axios.post(
        `${API_URL}/reviews/${productId}`,
        { comment, rating },
        { withCredentials: true }
    );
}