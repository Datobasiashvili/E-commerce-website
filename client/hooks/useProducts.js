import { useState, useEffect } from "react";
import { editProduct, deleteProduct, getUserProducts } from "../src/api/editProductAPI"

export function useProducts() {
    const [userProducts, setUserProducts] = useState([]);
    const [editProductMessage, setEditProductMessage] = useState("");
    const [editProductMessageType, setEditProductMessageType] = useState("");

    // useEffect(() => {
    //     const fetchUserProducts = async () => {
    //         try {
    //             const response = await getUserProducts();
    //             if (response.status === 200) {
    //                 setUserProducts(response.data);
    //             }
    //         } catch (err) {
    //             console.error(`Error getting user products: ${err}`);
    //             setUserProducts([]);
    //         }
    //     }

    //     fetchUserProducts();

    // }, [])

    const handleEditProduct = async (productId, formData, setProduct, setIsEditing, onSuccess) => {
        try {
            const response = await editProduct(productId, formData);
            if (response.status === 200) {
                setProduct(response.data.product);
                setIsEditing(false);
                setEditProductMessage(response?.data?.message);
                setEditProductMessageType("success");
                onSuccess?.();
            }
        } catch (err) {
            console.error(`Error while editing product: ${err}`);
            setEditProductMessage("Product editing failed");
            setEditProductMessageType("error");
        }
    }

    const handleDeleteProduct = async (productId, onSuccess) => {
        try {
            const response = await deleteProduct(productId);
            if(response.status === 200){
                setUserProducts(prev => prev.filter(p => p._id !== productId));
                onSuccess?.();
            }
        } catch (err){
            console.error(`Error deleting user product: ${err}`);
        }
    }

    return { handleEditProduct, handleDeleteProduct, editProductMessage, editProductMessageType, userProducts }
}