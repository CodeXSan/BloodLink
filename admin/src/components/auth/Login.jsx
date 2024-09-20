import React, { useEffect, useState } from 'react';
import '../../styles/Login.css';
import { Navigate, useNavigate } from 'react-router-dom';
import useAuth from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast'
const Login = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState(false);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])
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
        return <Navigate to="/dashboard" />;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8080/auth/admin/login", { identifier, password })
            const adminData = res.data;
            if (res.status === 200) {
                toast.success("Login successful");
                setAuth({
                    ...auth,
                    admin: {
                        id: adminData.id,
                        firstName: adminData.firstName,
                        middleName: adminData.middleName,
                        lastName: adminData.lastName,
                        phoneNumber: adminData.phoneNumber,
                        email: adminData.email,
                        createdDate: adminData.createdDate,
                        profileUpdatedDate: adminData.profileUpdatedDate
                    },
                    token: adminData.token,
                })
                localStorage.setItem('auth', JSON.stringify(res.data));
                navigate('/dashboard');
            }
            else if (res.status === 401) {
                toast.error("Bad Credentials");
            }

        } catch (error) {
            toast.error("Bad Credentials");
        }
    }

    return (
        <div className="login-container">
            <h1>Admin Login</h1>
            <form onSubmit={handleSubmit}>
                <label for="identifier">Username:</label>
                <input
                    type="text"
                    id="identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                />
                <label for="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)
                    }
                    required
                />
                <div className="submit-container">
                <input type="submit" value="Login" />
                </div>
            </form>
        </div>
    );
};
export default Login;
