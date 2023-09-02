import React, { useEffect, useState } from "react";

const Profile = () => {
  const id = JSON.parse(localStorage.getItem("user")).authToken;
  const [image, setImage] = useState("defaultImage.jpg");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [authId, setAuthId] = useState("");

  useEffect(() => {
    retrieveImage();
    getUser();
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
    console.log(image);
    const res = await fetch("https://shopnest-backend.onrender.com/api/image/imgProfile", {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "auth-token": `${id}`,
      },
      method: "POST",
      body: JSON.stringify({ image: image }),
    });
    const data = await res.json();
    if (data.Status === "ok") {
      alert("Image uploaded successfully.");
    } else {
      console.error("Error uploading image:", data.message);
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

  const getUser = async () => {
    if (id) {
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
    }
  };

  return (
    <>
      <div className="profileContainer">
        <div className="profile">
          <img src={image} alt="Profile Image" />
          <p>Upload Profile Picture</p>
          <input accept="image/*" type="file" onChange={getImg} />
          <button onClick={uploadImage}>Upload</button>
          <div>Name: {name} </div>
          <div>Email: {email} </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
