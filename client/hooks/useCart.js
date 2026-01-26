import { useState, useEffect } from "react"
import { addProductToCart, deleteProductFromCart, decreaseCartProductQuantity } from "../src/api/cartAPI";
import { useProducts } from "../src/components/ProductContext";
import axios from "axios";

export function useCart() {
    const [cartProducts, setCartProducts] = useState([]);
    const [cartMessage, setCartMessage] = useState("");
    const [cartMessageType, setCartMessageType] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;

    const productsContext = useProducts();
    const products = productsContext?.productData || [];

    const getCart = async () => {
        try {
            const response = await axios.get(`${API_URL}/cart`, { withCredentials: true });
            if (response.status === 200) {
                const cartFromBackend = response.data.cartProducts;

                const cartWithProductInfo = products
                    .filter(p => cartFromBackend.map(c => c.product).includes(p._id))
                    .map(p => {
                        const item = cartFromBackend.find(c => c.product === p._id);
                        return { ...p, quantity: item ? item.quantity : 0 };
                    });

                setCartProducts(cartWithProductInfo);
            }
        } catch (err) {
            console.error(err);
            setCartProducts([]);
        }
    };

    const handleAddToCart = async (product) => {
        if (updatingId === product._id) return; // block fast double clicks
        setUpdatingId(product._id);

        setCartProducts((prev) =>
            prev.some((p) => p._id === product._id)
                ? prev.map((p) =>
                    p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p
                )
                : [...prev, { ...product, quantity: 1 }]
        );

        try {
            const response = await addProductToCart(product._id);
            setCartMessage(response?.data?.message || "Added to cart");
            setCartMessageType("success");
        } catch (err) {
            console.error(err);
            setCartMessage("Failed to add product to cart");
            setCartMessageType("error");
            await getCart();
        } finally {
            setUpdatingId(null);

            setTimeout(() => {
                setCartMessage("");
                setCartMessageType("");
            }, 3500);
        }
    }

    const handleDecreaseCartQuantity = async (product) => {

        if (updatingId === product._id) return; // block fast double clicks
        setUpdatingId(product._id);

        setCartProducts((prev) =>
            prev
                .map((p) =>
                    p._id === product._id && p.quantity > 0
                        ? { ...p, quantity: p.quantity - 1 }
                        : p
                )
                .filter((p) => p.quantity > 0)
        );

        try {
            await decreaseCartProductQuantity(product._id);
        } catch (err) {
            console.error(err);
            await getCart(); // rollback from server
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteCartProduct = async (productId) => {
        try {
            const response = await deleteProductFromCart(productId);
            if (response.status === 200) getCart();
        } catch (err) {
            console.error(`Error during deleting the product from cart: ${err}`);
        }
    }

    useEffect(() => {
        if (products?.length) {
            getCart();
        }
    }, [products]);

    const getProductQuantity = (productId) => {
        const item = cartProducts?.find((p) => p._id === productId);
        return item ? item.quantity : 0;
    }

    return { updatingId, cartProducts, setCartProducts, getCart, handleAddToCart, handleDecreaseCartQuantity, getProductQuantity, handleDeleteCartProduct, cartMessage, cartMessageType }
}