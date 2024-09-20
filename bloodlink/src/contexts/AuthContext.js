import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const userData = JSON.parse(data);
      console.log("Loaded auth from localStorage:", userData);
      setAuth({
        user: {
          id: userData.id,
          firstName: userData.firstName,
          middleName: userData.middleName,
          lastName: userData.lastName,
          address: userData.address,
          location: userData.location,
          bloodGroup: userData.bloodGroup,
        },
        token: userData.token,
      });
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={[ auth, setAuth, loading ]}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export default useAuth;
