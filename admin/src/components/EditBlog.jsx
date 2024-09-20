import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams} from 'react-router-dom';
import useAuth from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const EditBlog = () => {
  const { id } = useParams();
  const [auth] = useAuth();
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    photoUrl: ''
  });
  const [file, setFile] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBlogDetails();
  }, []);

  const fetchBlogDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/blog/getblog/${id}`);
      setBlog(response.data);
    } catch (error) {
      toast.error('There was an error fetching the blog details!', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog((prevBlog) => ({
      ...prevBlog,
      [name]: value
    }));
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', blog.title);
    formData.append('content', blog.content);
    if (file) {
      formData.append('photo', file);
    }
    try {
      const response = await fetch(`http://localhost:8080/admin/blog/edit/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${auth.token}`
        },
        body: formData
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
     navigate('/dashboard/blogs');
    } catch (error) {
      toast.error('There was an error updating the blog!', error);
    }
  };

  return (
    <div className="container mt-5">
    <h1 className="mb-4">Edit Blog</h1>
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={blog.title}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="content" className="form-label">Content</label>
        <textarea
          id="content"
          name="content"
          value={blog.content}
          onChange={handleChange}
          className="form-control big-textarea"
          rows="10"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="file" className="form-label">Upload Photo</label>
        <input
          type="file"
          id="file"
          name="file"
          onChange={handleFileChange}
          className="form-control"
        />
      </div>
      <button type="submit" className="btn btn-primary">Save Changes</button>
    </form>
  </div>
  );
};

export default EditBlog;
