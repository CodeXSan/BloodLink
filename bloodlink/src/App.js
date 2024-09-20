import './App.css';
import { Route, Routes } from 'react-router-dom';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import BlogDetail from './components/Pages/BlogDetail';
import Layout from './components/Layout/Layout';
import { AuthProvider } from './contexts/AuthContext';
import Profile from './components/Pages/Profile';
import EditProfile from './components/Pages/EditProfile'
import PrivateRoute from './routes/PrivateRoute';
import HomePage from './components/Pages/HomePage';
import RequestBlood from './components/Pages/RequestBlood';
import NearbyDonors from './components/Pages/NearbyDonors';
import CreateRequest from './components/Pages/CreateRequest';
import About from './components/Pages/About';
import AllBlogs from './components/Pages/AllBlogs'
import DonatePage from './components/Pages/DonatePage';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import TokenConfirmation from './components/Auth/TokenConfirmation';
import DonationHistory from './components/Pages/DonationHistory';

function App() {
  return (
    <AuthProvider>
      <div className='App'>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/confirm-token" element={<TokenConfirmation />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<PrivateRoute />}>
              <Route path="" element={<Profile />} />
              <Route path="edit" element={<EditProfile />} />
            </Route>
            
            <Route path="/blog" element={<AllBlogs />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path='/create-request' element={<CreateRequest />} />
            <Route path='/request-blood' element={<RequestBlood />} />
            <Route path='/nearby-donors' element={<NearbyDonors />} />
          </Routes>
        </Layout>
      </div>
    </AuthProvider>
  );
}

export default App;
