import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    let result = await fetch("https://shopnest-backend.onrender.com/api/products/getProducts");
    result = await result.json();
    setProducts(result);
  }
  console.warn(products);

  const handleDeleteProduct = async (id) => {
    await fetch(`https://shopnest-backend.onrender.com/api/products/product/${id}`, {
      method: 'Delete'
    });

    // After deletion, update the products state by removing the deleted product from the list
    setProducts(prevProducts => prevProducts.filter(product => product._id !== id));
  };

  const handleSearch = async (event) => {
    let key = event.target.value;
    if (key) {
      let result = await fetch(`https://shopnest-backend.onrender.com/api/products/search/${key}`);
      result = await result.json();
      if (result) {
        setProducts(result);
      }
    }
    else {
      getProducts();
    }
  }

  return (
    <>
      <input className="searchInput" onChange={handleSearch} type="text" placeholder='Seach' />
      <div className="productList-container">
        {console.log(products)}
        {
          products.length > 0 ? products.map((item, index) =>
            <div className="productCard">
              <ul>
                <li><img src={item.image} alt={item.name} /></li>
                <li>Name: {item.name}</li>
                <li>Price: {item.price}</li>
                <li>Category: {item.category}</li>
                <li>Company: {item.company}</li>
              </ul>
              <div>
                <button><Link to={"/update/"+item._id}>Update</Link></button>
                <button onClick={() => { handleDeleteProduct(item._id) }} >Delete</button>
              </div>
            </div>
          )
            :
            <h1>No Results Found</h1>
        }
      </div>
    </>
  );
};

export default ProductsList;
