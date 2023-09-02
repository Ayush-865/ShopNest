import React, { useEffect, useState } from 'react'
import ProductContext from './productContext';

const ProductState = (props) => {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        getProducts();
    }, [products]);

    const getProducts = async () => {
        let response = await fetch("https://shopnest-backend.onrender.com/api/products/getProducts");
        if (response.ok) {
            let result = await response.json();
            setProducts(result);
        } else {
            let errorMessage = await response.text();
            alert(errorMessage);
        }
    }

    const handleDeleteProduct = async (id) => {
        await fetch(`https://shopnest-backend.onrender.com/api/products/product/${id}`, {
          method: 'Delete'
        });
        // After deletion, update the products state by removing the deleted product from the list
        setProducts(prevProducts => prevProducts.filter(product => product._id !== id));
    };

    return (
        <>
            <ProductContext.Provider value={{ products  ,handleDeleteProduct }}>
                {props.children}
            </ProductContext.Provider>
        </>
    )
}

export default ProductState
