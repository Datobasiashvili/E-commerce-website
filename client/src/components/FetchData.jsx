import { useState, useEffect } from "react";
import Home from "./Home";
import { ProductContext } from "./ProductContext";

export default function FetchData() {
  const [productData, setProductData] = useState([]);

  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProductData(data.products);
      })
      .catch((err) => `Error: ${err}`);
  }, []);

  console.log(productData);

  return (
    <>
      <ProductContext.Provider value={productData}>
        <Home data={productData} chunkArray={chunkArray} />
      </ProductContext.Provider>
    </>
  );
}
