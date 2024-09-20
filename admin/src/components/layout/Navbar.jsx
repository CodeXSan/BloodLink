
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../styles/Navbar.css'
import { BiSolidDonateBlood } from 'react-icons/bi'
import { IoIosPeople, IoIosLogOut } from 'react-icons/io'
import { FaBlog, FaBlogger, FaHeartPulse } from 'react-icons/fa6'
import useAuth from '../../contexts/AuthContext';
import logo from '../../assests/images/logo.jpeg'
const Navbar = () => {
  const [auth, setAuth] = useAuth()

  const navigate = useNavigate()
  const handleLogout = (e) => {
    e.preventDefault();
    setAuth({
      ...auth,
      user: null,
      token: ''
    });
    localStorage.removeItem('auth');
    navigate('/');
  };
  return (
    <div className="navbar">
      <NavLink to="/dashboard" >
            <span className="logo">
              <img src={logo} alt="BloodLink" />
            </span>
          </NavLink>
          <div className="navigation">
      <ul>
        <li>
          <NavLink to="/dashboard/donors" >
            <span className="icon">
              <BiSolidDonateBlood />
            </span>
            <span className="title">Donors</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/requests">
            <span className="icon">
              <IoIosPeople />
            </span>
            <span className="title">Requests</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/donated">
            <span className="icon">
              <FaHeartPulse />
            </span>
            <span className="title">Donated</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/blogs">
            <span className="icon">
              <FaBlogger />
            </span>
            <span className="title">Blogs</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/blog/create">
            <span className="icon">
              <FaBlog />
            </span>
            <span className="title">Create Blog</span>
          </NavLink>
        </li>
        </ul>
            <button onClick={handleLogout} className='log-btn'>
              <span className="icon">
                <IoIosLogOut />
              </span>
              Log Out
            </button>
            </div>
    </div>
  );
};

export default Navbar;