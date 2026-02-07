import { useState } from "react";
import { editProduct, deleteProduct } from "../src/api/editProductAPI"

export function useProducts() {
    const [editProductMessage, setEditProductMessage] = useState("");
    const [editProductMessageType, setEditProductMessageType] = useState("");

    const handleEditProduct = async (productId, formData, setProduct, setIsEditing) => {
        try {
            const response = await editProduct(productId, formData);
            if (response.status === 200) {
                setProduct(response.data.product);
                setIsEditing(false);
                setEditProductMessage(response?.data?.message);
                setEditProductMessageType("success");
            }
        } catch (err) {
            console.error(`Error while editing product: ${err}`);
            setEditProductMessage("Product editing failed");
            setEditProductMessageType("error");
        }
    }

    const handleDeleteProduct = async (productId) => {
        return await deleteProduct(productId);
    }

    return { handleEditProduct, handleDeleteProduct, editProductMessage, editProductMessageType }
}