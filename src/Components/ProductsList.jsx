import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import productContext from "../context/productContext";

const ProductsList = () => {
  const {products, setProducts,getProducts, productsIsLoading, authId}=useContext(productContext);

  const handleDeleteProduct = async (id) => {
    await fetch(
      `https://shopnest-backend.onrender.com/api/products/product/${id}`,
      {
        method: "Delete",
      }
    );

    // After deletion, update the products state by removing the deleted product from the list
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product._id !== id)
    );
  };

  const handleSearch = async (event) => {
    let key = event.target.value;
    if (key) {
      let result = await fetch(
        `https://shopnest-backend.onrender.com/api/products/search/${key}`
      );
      result = await result.json();
      if (result) {
        setProducts(result);
      }
    } else {
      getProducts();
    }
  };

  return (
    <>
      {productsIsLoading == true ? (
        <Loader />
      ) : (
        <>
          <div className="searchInputContainer">
            <input
              className="inputBox searchInput"
              onChange={handleSearch}
              type="text"
              placeholder="Seach Products"
            />
          </div>
          <div className="productList-container">
            {console.log(products)}
            {products.length > 0 ? (
              products.map((item, index) => (
                <div className="productCard">
                  <ul>
                    <li>
                      <img src={item.image} alt={item.name} />
                    </li>
                    <li>Name: {item.name}</li>
                    <li>Price: {item.price}</li>
                    <li>Category: {item.category}</li>
                    <li>Company: {item.company}</li>
                  </ul>
                  {String(authId) === String(item.user) ? (
                    <div>
                      <button>
                        <Link to={"/update/" + item._id}>Update</Link>
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteProduct(item._id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <p></p>
                  )}
                </div>
              ))
            ) : (
              <h1>No Products Found</h1>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ProductsList;
