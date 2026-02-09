import { useProducts } from "../../hooks/useProducts"

export default function UserProducts(){
    const { userProducts } = useProducts();
    return (
        <>
            {userProducts.map(product => (
                <div key={product._id}>
                    <p>{product.title}</p>
                </div>
            ))}
        </>
    )
}