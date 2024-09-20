import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";
import useAuth from '../../contexts/AuthContext'
function NavBar() {
  const [click, setClick] = useState(false);
  const [auth] = useAuth();

  const handleClick = () => setClick(!click);
  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <NavLink exact to="/" className="nav-logo">
            <span>BloodLink</span>
          </NavLink>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <NavLink
                exact
                to="/"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/about"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/blog"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Blog
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/create-request"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Request
              </NavLink>
            </li>
            {/* <li className="nav-item">
              <NavLink
                exact
                to="/contact"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Contact
              </NavLink>
            </li> */}
            <li className="nav-item">
              {auth.user ? (
                <>
                  <NavLink
                    exact
                    to="/donate"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Donate
                  </NavLink>
                  <NavLink
                    exact
                    to="/profile"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Profile
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    exact
                    to="/login"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    exact
                    to="/signup"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
            </li>
          </ul>
          <div className="nav-icon" onClick={handleClick}>
            {click ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
