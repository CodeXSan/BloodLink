import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    admin: null,
    token: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const adminData = JSON.parse(data);
      setAuth({
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
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${auth?.token}`;
  }, [auth]);

  return (
    <AuthContext.Provider value={[ auth, setAuth, loading ]}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export default useAuth;
