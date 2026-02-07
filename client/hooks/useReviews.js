import { useState, useEffect } from "react";

export function useReviews() {
    const [reviews, setReviews] = useState([]);

    const getReviews = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/products/${productId}/reviews`
            );
            setReviews(res.data);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        }
    }

    useEffect(() => {
        getReviews();
    }, []);
}

