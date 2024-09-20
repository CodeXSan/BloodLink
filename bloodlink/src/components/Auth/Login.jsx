import React, { useEffect, useState } from 'react';
import './Login.css';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import useAuth from '../../contexts/AuthContext';

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const authCheck = async () => {
        try {
            const res = await axios.get('http://localhost:8080/auth/user-auth', {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            if (res.status === 200) {
                setAuthenticated(true);
            } else {
                setAuthenticated(false);
            }
        } catch (error) {
            setAuthenticated(false);
        }
    };

    if (auth?.token) {
        authCheck();
    }
}, [auth?.token]);

  if (authenticated) {
    return <Navigate to="/profile/donor" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/auth/donor/login", { identifier, password })
      const userData = res.data;
      if (res.status === 200) {
        toast.success("Login successful");
        setAuth({
          ...auth,
          user: {
            id: userData.id,
            firstName: userData.firstName,
            middleName: userData.middleName,
            lastName: userData.lastName,
            address: userData.address,
            location: userData.location,
            bloodGroup : userData.bloodGroup
          },
          token: userData.token,
        })
        console.log(auth.user)
        console.log(auth.token)
        localStorage.setItem('auth', JSON.stringify(res.data));
        navigate(location.state || '/');
      }
      else if (res.status === 404) {
        toast.error("Bad Credential");
      }

    } catch (error) {
      toast.error("Error while logging");
    }
  }
  const handleForgotPassword = () => {
    navigate('/forgot-password');
  }
  return (
    <div className="auth-container" style={{width:'500px'}}>
    <h2>Login</h2>
     {/* {errorMessages.length > 0 && (
      <div className="alert alert-danger">
        <h6>Error:</h6>
        <ul>
          {errorMessages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div> */}
    {/* )} */}
      <form onSubmit={handleSubmit}>
      <div className="row">
        <input type="text" placeholder="Email or Phone Number" required
          value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
          </div>
          <div className="row">
        <input type="password" placeholder="Password" required
          value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <p className="forgot-password" onClick={handleForgotPassword} style={{ cursor: 'pointer' }}>Forgot Password?</p>
      <p className="text-center mt-3">Not a member? <Link to='/signup' data-toggle="tab" >Sign Up</Link></p>
    </div>
  );
};

export default Login;
