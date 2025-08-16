import { useState } from "react";
import { useProducts } from "./ProductContext";
import "../styles/searchbar.css";
import { use } from "react";
import e from "cors";

export default function Searchbar() {
  const products = useProducts();

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = products.filter((p) =>
      p.title.toLowerCase().includes(query)
    );
  };

  return (
    <input type="text" placeholder="Search for..." onChange={handleSearch} />
  );
}
