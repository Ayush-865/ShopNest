import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from './Loader';

const AddProduct = () => {

  const [isloading, setIsLoading] = useState(false);

  const [productImage, setProductImage] = useState("./defaultProduct.jpg")
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const id = JSON.parse(localStorage.getItem('user')).authToken;
  const [error, setError]=useState(false);

  const navigate = useNavigate();

  const converttoBase64 = (file) => {

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = error => {
        console.log("Error:", error);
        reject(reader.result)
      };
    })
  }

  const getProductImg = async (e) => {
    const img = await converttoBase64(e.target.files[0]);
    setProductImage(img)
  }

  const handleAddProduct = async () => {
    if(!name || !price || !category || !company){
      setError(true)
      return false;
    }
    try {
      setIsLoading(true);
      const res = await fetch("https://shopnest-backend.onrender.com/api/products/addProduct", {
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
        'auth-token': `${id}`
      },
      method: "POST",
      body: JSON.stringify({ "name": name, "price": price, "company": company, "category": category, "image": productImage })
    })
    const data = await (res.json());
    
    if (data.Status === "ok") {
      navigate("/");
    } else {
      console.error("Error uploading image:", data.message);
    }
    } catch (error) {
      
    }finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      {
        isloading==true ? (
          <Loader/>
        ):(
      <div className="addProductContainer">
        <div className="addProduct">
          <h1>Add Product</h1>
          <img src={productImage} alt='Profile Image' />
          <input className='target' accept='image/*' type='file' onChange={getProductImg} />
          <input id='one' className={`${error && !name ? 'redplaceholder inputBox' : 'inputBox'}`} type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Name' autocomplete="off" />
          <input id='two' className={`${error && !price ? 'redplaceholder inputBox' : 'inputBox'}`} type='text' value={price} onChange={(e) => setPrice(e.target.value)} placeholder='Enter Price' autocomplete="off"/>
          <input id='three' className={`${error && !category ? 'redplaceholder inputBox' : 'inputBox'}`} type='text' value={category} onChange={(e) => setCategory(e.target.value)} placeholder='Enter Category' autocomplete="off"/>
          <input id='four' className={`${error && !company ? 'redplaceholder inputBox' : 'inputBox'}`} type='text' value={company} onChange={(e) => setCompany(e.target.value)} placeholder='Enter Company' autocomplete="off"/>
          <button className='loginbutton' type='button' onClick={handleAddProduct}>Add</button>
        </div>
      </div>
        )
      }
    </>
  )
}

export default AddProduct
