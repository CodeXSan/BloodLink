import React from 'react';
import Navbar from '../Header/Navbar';
import Footer from '../Footer/Footer';
import { Toaster } from 'react-hot-toast';

const Layout = (props) => {
  return (
    <div>
        <Navbar />
        <main style={{minHeight:'69vh'}}>
          <Toaster/>
        {props.children}
        </main>
        <Footer />
    </div>
  )
}

export default Layout;
