import { createContext, useContext } from "react";

export const ProductContext = createContext(null);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    // Instead of throwing, return a safe fallback
    return { productData: [], setProductData: () => {} };
  }
  return context;
};