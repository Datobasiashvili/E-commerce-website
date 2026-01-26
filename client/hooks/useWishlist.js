import { useState, useContext } from "react";
import { UserContext } from "../src/components/App";
import { addToWishlist } from "../src/api/wishlistAPI";
import axios from "axios";

export function useWishlist() {
    const [wishlistIds, setWishlistIds] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;
    const { isAuthenticated } = useContext(UserContext);

    const getWishlist = async () => {
        if(!isAuthenticated) return;
        try {
            const response = await axios.get(
                `${API_URL}/wishlist`,
                { withcredentials: true }
            );
            if (response.status === 200) {
                setWishlistIds(response.data.wishlistIds || []);
            }
        } catch (err) {
            console.error(err.response?.data || err.message);
            setWishlistIds([]);
        }
    }

    const handleAddToWishlist = async(productId) => {
        if(!isAuthenticated) return;
        try {
            await addToWishlist(productId);
        } catch (err){
            console.error(`Error adding product to wishlist: ${err}`);
            await getWishlist();
        }
    }

    return { wishlistIds, setWishlistIds, getWishlist, handleAddToWishlist };
}