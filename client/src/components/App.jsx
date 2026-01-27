import { useState, useEffect, createContext } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";

import { ProductContext } from "./ProductContext";
import Home from "./Home.jsx";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import Account from "./Account.jsx";
import Cart from "./Cart.jsx";
import Wishlist from "./Wishlist.jsx";
import Product from "./Product.jsx";
import AddProduct from "./AddProduct.jsx";
import axios from "axios";
import Layout from "./Layout.jsx";

export const UserContext = createContext();

function App() {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [productData, setProductData] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProductData(data);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/account`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.isAuthenticated) {
          setUser(res.data.user);
          setIsAuthenticated(true);
        } else {
          setUser({});
          setIsAuthenticated(false);
        }
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
        setUser({});
        setIsAuthenticated(false);
      });
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/products/:productId" element={<Product />} />
        <Route path="/product/add" element={<AddProduct />} />
      </Route>
    )
  );

  return (
    <ProductContext.Provider value={{ productData, setProductData }}>
      <UserContext.Provider
        value={{ user, setUser, isAuthenticated, setIsAuthenticated }}
      >
        <RouterProvider router={router} />
      </UserContext.Provider>
    </ProductContext.Provider>
  );
}

export default App;
