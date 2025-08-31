import Header from "./Header";
import { useState, useEffect, useContext } from "react";
import { useProducts } from "./ProductContext";
import { UserContext } from "./App";
import axios from "axios";

export default function Wishlist() {
  const { isAuthenticated } = useContext(UserContext);
  const [productIds, setProductIds] = useState();
  const productsContext = useProducts();
  const products = productsContext?.productData || [];

  const getWishlist = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/wishlist", {
        withCredentials: true,
      });

      if (response.status === 200) {
        setProductIds(response.data);
        console.log("WISHLIST IDS:");
        console.log(response.data.wishlistIds);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setProductIds();
    }
  };

  useEffect(() => {
    getWishlist()
  }, [])

  return (
    <>
      <Header />
    </>
  );
}
