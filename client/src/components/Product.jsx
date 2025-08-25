import { useParams } from "react-router-dom";
import { useProducts } from "./ProductContext";

export default function Product(){
    const products = useProducts();
    const productID = useParams();

    

}