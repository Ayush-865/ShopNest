import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProduct = () => {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [company, setCompany] = useState("");

    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        getProductDetails();
    }, []);

    const getProductDetails = async () => {
        let result = await fetch(`https://shopnest-backend.onrender.com/api/products/product/${params.id}`);
        result = await result.json();
        console.warn(result)
        setName(result.name);
        setPrice(result.price);
        setCategory(result.category);
        setCompany(result.company);
    }

    const handleUpdateProduct = async () => {
        let result = await fetch(`https://shopnest-backend.onrender.com/api/products/product/${params.id}`, {
            method: 'Put',
            body: JSON.stringify({ name, price, category, company }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if (result) {
            navigate('/');
        }
    }

    return (
        <>
        <div className="updateProductContainer">
            <div className="updateProduct">
                <h1>Update Product</h1>
                <div className="addproduct">
                    <input className='inputBox ' type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Name of Product' />
                    <input className='inputBox ' type='text' value={price} onChange={(e) => setPrice(e.target.value)} placeholder='Enter Price of Product' />
                    <input className='inputBox ' type='text' value={category} onChange={(e) => setCategory(e.target.value)} placeholder='Enter Category of Product' />
                    <input className='inputBox ' type='text' value={company} onChange={(e) => setCompany(e.target.value)} placeholder='Enter Company of Product' />
                </div>
                <button className='loginbutton' type='button' onClick={handleUpdateProduct}>Update PRODUCT</button>
            </div>
        </div>
        </>
    )
}

export default UpdateProduct