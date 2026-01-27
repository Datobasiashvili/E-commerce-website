import { useState, useEffect, useMemo } from "react";
import { addToWishlist, removeFromWishlist } from "../src/api/wishlistAPI";
import { useProducts } from "../src/components/ProductContext";
import axios from "axios";

export function useWishlist() {
    // wishlistMessage and wishlistMessageType are for Product.jsx
    const [wishlistIds, setWishlistIds] = useState([]);
    const [wishlistMessage, setWishlistMessage] = useState("");
    const [wishlistMessageType, setWishlistMessageType] = useState("");
    const API_URL = import.meta.env.VITE_API_URL;

    const productsContext = useProducts();
    const products = productsContext?.productData || [];

    const getWishlist = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/wishlist`,
                { withCredentials: true }
            );
            if (response.status === 200) {
                setWishlistIds(response.data.wishlistIds || []);
            }
        } catch (err) {
            console.error(err.response?.data || err.message);
            setWishlistIds([]);
        }
    }

    useEffect(() => {
        if (products?.length) {
            getWishlist();
        }
    }, [products, API_URL]);

    const handleAddToWishlist = async (productId) => {
        try {
            const response = await addToWishlist(productId);
            setWishlistIds(response.data.wishlist || []);
            setWishlistMessage(response?.data?.message || "Added to wishlist");
            setWishlistMessageType("success");
        } catch (err) {
            console.error(`Error adding product to wishlist: ${err}`);
            setWishlistMessage("Failed to add product to wishlist");
            setWishlistMessageType("error");
        } finally {
            setTimeout(() => {
                setWishlistMessage("");
                setWishlistMessageType("");
            }, 3500);
        }
    }

    const handleDeleteFromWishlist = async (productId) => {
        try {
            const response = await removeFromWishlist(productId);
            setWishlistIds(response.data.wishlist || []);
        } catch (err) {
            console.error("Delete wishlist error:", err.response?.data || err.message);
        }
    }

    // ensure we match string/ObjectId correctly. 
    const wishlistProducts = useMemo(
        () => products.filter(p => wishlistIds.some(id => id.toString() === p._id.toString())),
        [products, wishlistIds]
    );

    return { wishlistProducts, wishlistMessage, wishlistMessageType, wishlistIds, getWishlist, handleAddToWishlist, handleDeleteFromWishlist };
}