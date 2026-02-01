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
            let response;

            //For Home.jsx's addToWishlist button
            if (wishlistIds.includes(productId)) {
                response = await removeFromWishlist(productId);
                setWishlistIds((prev) => prev.filter((id) => id !== productId));
                setWishlistMessageType("info");
            } else {
                response = await addToWishlist(productId);
                setWishlistIds((prev) => [...prev, productId]);

                if (response.status === 201) {
                    setWishlistMessageType("success");
                } else if (response.status === 200) {
                    setWishlistMessageType("info");
                } else {
                    setWishlistMessageType("error");
                }
            }

            setWishlistMessage(response?.data?.message || "");
        } catch (err) {
            console.error(`Wishlist error: ${err}`);
            setWishlistMessage("Wishlist action failed");
            setWishlistMessageType("error");
        } finally {
            setTimeout(() => {
                setWishlistMessage("");
                setWishlistMessageType("");
            }, 1750);
        }
    };

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