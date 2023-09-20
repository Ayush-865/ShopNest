import React, { useContext, useEffect, useState } from "react";
import Loader from "./Loader";
import productContext from "../context/productContext";

const Profile = () => {
  const [isloading, setIsLoading] = useState(false);
  const id = JSON.parse(localStorage.getItem("user")).authToken;
  const [image, setImage] = useState("defaultImage.jpg");

  const {name, email, profileIsLoading}=useContext(productContext);

  useEffect(() => {
    retrieveImage();
  }, []);

  const converttoBase64 = (file) => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        console.log("Error:", error);
        reject(reader.result);
      };
    });
  };

  const uploadImage = async () => {
    try {
      setIsLoading(true);
      if (image === "defaultImage.jpg") {
        alert("Select an Image");
      } else {
        console.log(image);
        const res = await fetch(
          "https://shopnest-backend.onrender.com/api/image/imgProfile",
          {
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              "auth-token": `${id}`,
            },
            method: "POST",
            body: JSON.stringify({ image: image }),
          }
        );
        const data = await res.json();
        if (data.Status === "ok") {
          alert("Image uploaded successfully.");
        } else {
          console.error("Error uploading image:", data.message);
        }
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while logging in.");
    } finally {
      setIsLoading(false);
    }
  };

  const retrieveImage = async () => {
    const retrieveimage = await fetch(
      "https://shopnest-backend.onrender.com/api/image/imgProfile",
      {
        method: "get",
        headers: {
          "auth-token": `${id}`,
        },
      }
    );
    const retrievedImage = await retrieveimage.json();
    if (retrievedImage.length != 0) {
      setImage(retrievedImage.image);
    }
  };

  const getImg = async (e) => {
    const img = await converttoBase64(e.target.files[0]);
    setImage(img);
  };

  return (
    <>
      {profileIsLoading == true || isloading==true ? (
        <Loader />
      ) : (
        <div className="profileContainer">
          <div className="profile">
            <img src={image} alt="Profile Image" />
            <p>Upload Profile Picture (Only Once) </p>
            <input accept="image/*" type="file" onChange={getImg} />
            <button onClick={uploadImage}>Upload</button>
            <div>Name: {name} </div>
            <div>Email: {email} </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
