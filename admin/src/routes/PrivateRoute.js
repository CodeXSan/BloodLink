import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../contexts/AuthContext';
import Spinner from '../components/Spinner';
import axios from 'axios';
import Layout from '../components/layout/Layout';

const PrivateRoute = () => {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();

  useEffect(() => {
      const authCheck = async () => {
          try {
              const res = await axios.get('http://localhost:8080/auth/user-auth', {
                  headers: {
                      Authorization: `Bearer ${auth.token}`,
                  },
              });
              console.log(res)
              if (res.status === 200) {
                  setOk(true);
              } else {
                  setOk(false);
              }
          } catch (error) {
              console.error('Error checking authentication:', error);
              setOk(false);
          }
      };

      if (auth?.token) {
          authCheck();
      }
  }, [auth?.token]);

  return ok ? <Layout><Outlet /></Layout> : <Layout> <Spinner /></Layout>;
};

export default PrivateRoute;