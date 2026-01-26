<<<<<<< HEAD
import { useState, useEffect, createContext } from "react";
=======
>>>>>>> ddd6f5e2493fe3f07c819747f4d2599ccaa64c16
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
<<<<<<< HEAD
import axios from "axios";
import Layout from "./Layout.jsx";
=======
import { useState, useEffect, createContext } from "react";
import axios from "axios";
>>>>>>> ddd6f5e2493fe3f07c819747f4d2599ccaa64c16

export const UserContext = createContext();

function App() {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [productData, setProductData] = useState([]);

<<<<<<< HEAD
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/products`)
=======
  useEffect(() => {
    fetch("https://e-commerce-website-47sr.onrender.com/api/products")
>>>>>>> ddd6f5e2493fe3f07c819747f4d2599ccaa64c16
      .then((res) => res.json())
      .then((data) => {
        setProductData(data);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    axios
<<<<<<< HEAD
      .get(`${API_URL}/account`, {
=======
      .get("https://e-commerce-website-47sr.onrender.com/api/account", {
>>>>>>> ddd6f5e2493fe3f07c819747f4d2599ccaa64c16
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
<<<<<<< HEAD
      <Route element={<Layout />}>
=======
      <>
>>>>>>> ddd6f5e2493fe3f07c819747f4d2599ccaa64c16
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/products/:productId" element={<Product />} />
        <Route path="/product/add" element={<AddProduct />} />
<<<<<<< HEAD
      </Route>
=======
      </>
>>>>>>> ddd6f5e2493fe3f07c819747f4d2599ccaa64c16
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
