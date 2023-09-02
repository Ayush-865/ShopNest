import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const Login = () => {
  const [isloading, setIsLoading]=useState(false);
  const navigate = useNavigate();
   //very imp to note //using this we check if data is stored in local storage and navigate the user to "/"
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("user"));
    if (auth) {
      navigate("/");
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const result = await fetch("https://shopnest-backend.onrender.com/api/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await result.json();

      if (result.status === 500) {
        let errorMessage=data.error;
        alert(errorMessage);
      } if (result.status === 400) {
        let errorMessages = data.errors.map(error => error.msg).join('\n');
        alert(errorMessages);
      } else if(result.status === 404) {
        let errorMessage = data.error;
        alert(errorMessage); 
      } else if (result.status === 200) {
        localStorage.setItem("user", JSON.stringify(data)); 
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while logging in.");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <>
    {
      isloading==true ?
      (
        <Loader/>
      ):(
      <div className="loginContainer">
      <div className="login">
        <h1>LOGIN</h1>
        <input className='inputBox' type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Email' />
        <input className='inputBox' type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter Password' />
        <button className='loginbutton' type='button' onClick={handleLogin}>LOGIN UP</button>
      </div>
      </div>
      )
    }
    </>
  );
};

export default Login;
