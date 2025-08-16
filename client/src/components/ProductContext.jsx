// I am using useContext react hook to pass down the product data from FetchData component down to the deep child Searchbar component.
import { createContext, useContext } from "react";

export const ProductContext = createContext();

export const useProducts = () => {
  return useContext(ProductContext);
};