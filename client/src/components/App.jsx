import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";

import FetchData from "./FetchData.jsx";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import Account from "./Account.jsx";
import Cart from "./Cart.jsx";
import Favorites from "./Favorites.jsx";
import Product from "./Product.jsx";
import { useState, useEffect, createContext } from "react";
import axios from "axios";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<FetchData />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/account" element={<Account />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path = '/products/:productID/' element={<Product />} />
    </>
  )
);

export const UserContext = createContext();

function App() {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/account", { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setIsAuthenticated(res.data.isAuthenticated);
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
        setUser({});
        setIsAuthenticated(false);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated }}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  );
}

export default App;