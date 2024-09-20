import React from 'react';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

const Layout = (props) => {
  return (
    <div className="app-container d-flex flex-column min-vh-100">
      <div className="sidebar">
        <Navbar />
      </div>
      <div className="main-content flex-grow-1" style={{ marginLeft: '320px' }}>
        <Toaster />
        {props.children}
      </div>
      <footer className="bg-light text-center py-3 mt-auto">
        <div className="container">
          <p className="mb-0">&copy; 2024 BloodLink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
