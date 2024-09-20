import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PacmanLoader from 'react-spinners/PacmanLoader'
const Spinner = ({ path = "login" }) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
    }, 1000);
    count === 0 &&
      navigate(`/${path}`, {
        state: location.pathname,
      });
    return () => clearInterval(interval);
  }, [count, navigate, location, path]);
  return (
    <>
      <div
        className="d-flex flex-column justify-content-center align-items-center ali"
        style={{ height: "100vh" }}
      >
        <div className="spinner-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden"><PacmanLoader /></span>
        </div>
      </div>
    </div>
    </>
  );
};

export default Spinner;