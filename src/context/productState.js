import React, { useEffect, useState } from 'react'
import ProductContext from './productContext';

const ProductState = (props) => {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        getProducts();
    },[]);

  const [productsIsLoading, setProductsIsLoading] = useState(false);
    const getProducts = async () => {
        try {
            setProductsIsLoading(true);
            let result = await fetch(
                "https://shopnest-backend.onrender.com/api/products/getProducts"
            );
            result = await result.json();
            setProducts(result);
        } catch (error) {
        } finally {
            setProductsIsLoading(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        await fetch(`https://shopnest-backend.onrender.com/api/products/product/${id}`, {
            method: 'Delete'
        });
        // After deletion, update the products state by removing the deleted product from the list
        setProducts(prevProducts => prevProducts.filter(product => product._id !== id));
    };

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [authId, setAuthId] = useState("");
    const [profileIsLoading, setProfileIsLoading] = useState(false);

    // Check for login status in local storage
    const isLoggedIn = !!localStorage.getItem("user");

    useEffect(() => {
        if (isLoggedIn) {
            getUser();
        }
    }, []);

    const getUser = async () => {
        try {
            setProfileIsLoading(true);
            if (localStorage.getItem("user")) {
                const id = JSON.parse(localStorage.getItem("user")).authToken;
                const getUserData = await fetch(
                    "https://shopnest-backend.onrender.com/api/auth/getUser",
                    {
                        method: "get",
                        headers: {
                            "auth-token": `${id}`,
                        },
                    }
                );
                const data = await getUserData.json();
                setName(data.name);
                setEmail(data.email);
                setAuthId(data._id);
            } else {
                console.log("user not found");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while logging in.");
        } finally {
            setProfileIsLoading(false);
        }
    };

    return (
        <>
            <ProductContext.Provider value={{ products,setProducts,productsIsLoading, getProducts, handleDeleteProduct, name, email, authId, profileIsLoading }}>
                {props.children}
            </ProductContext.Provider>
        </>
    )
}

export default ProductState
