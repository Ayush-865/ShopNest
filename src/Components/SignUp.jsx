import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isloading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("user"));
    if (auth) {
      navigate("/");
    }
  }, []);

  const collectData = async () => {
    setIsLoading(true);
    try {
      const result = await fetch(
        "https://shopnest-backend.onrender.com/api/auth/register",
        {
          method: "post",
          body: JSON.stringify({ name, email, password }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await result.json();

      if (result.status === 400) {
        let errorMessages = data.errors.map((error) => error.msg).join("\n");
        alert(errorMessages);
      } else if (result.status === 404) {
        let errorMessage = data.error;
        alert(errorMessage);
      } else if (result.status === 200) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/");
      }
    } catch (error) { 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isloading == true ? (
        <Loader />
      ) : (
        <div className="registerContainer">
          <div className="register">
            <h1>REGISTER</h1>
            <input
              className="inputBox"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter name"
            />
            <input
              className="inputBox"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Enter email"
            />
            <input
              className="inputBox"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter password"
            />
            <button
              className="signupbutton"
              type="button"
              onClick={collectData}
            >
              SignUp
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUp;
