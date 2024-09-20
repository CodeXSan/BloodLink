import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/auth/Login';
import { AuthProvider } from './contexts/AuthContext';
import Donors from './components/Donors';
import PrivateRoute from './routes/PrivateRoute'
import Home from './components/Home';
import Layout from './components/layout/Layout';
import AllBlogs from './components/AllBlogs';
import BlogDetail from './components/BlogDetail';
import CreateBlog from './components/CreateBlog';
import EditBlog from './components/EditBlog';
import RequestsTable from './components/RequestsTable';
import DonorsTable from './components/DonorTable';
import DonatedTable from './components/DonatedTable';
function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route path='/dashboard' element={<PrivateRoute />}>
            <Route path='' element={<Home />} />
            <Route path='donors' element={<Donors />} />
            <Route path='donors/table' element={<DonorsTable />} />
            <Route path='blogs' element={<AllBlogs/>} />
            <Route path='blog/:id' element={<BlogDetail/>} />
            <Route path='blog/create' element={<CreateBlog/>} />
            <Route path='editblog/:id' element={<EditBlog/>} />
            <Route path='requests' element={<RequestsTable/>} />
            <Route path='donated' element={<DonatedTable/>} />
          </Route>
        </Routes>
    </AuthProvider>
  );
}

export default App;
