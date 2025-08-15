import { useState, useEffect } from "react";
import Home from "./Home";

export default function FetchData() {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then((res) => res.json())
      .then((data) => {
        setProductData(data.products);
      })
      .catch((err) => `Error: ${err}`);
  }, []);

  console.log(productData);

  return <Home data={productData} />
}
