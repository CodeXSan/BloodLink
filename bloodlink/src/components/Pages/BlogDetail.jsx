import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './BlogDetail.css'
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [picture, setPicture] = useState('');
  const navigate = useNavigate()

  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])
  
  useEffect(() => {
    axios.get(`http://localhost:8080/blog/getblog/${id}`)
      .then(response => {
        setBlog(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (blog && blog.photoUrl) {
      axios.get(`http://localhost:8080/blog/getblog/photo/${blog.photoUrl}`, {
        responseType: 'arraybuffer',
      })
      .then(response => {
        const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(imageBlob);
        setPicture(imageUrl);
      })
      .catch(error => {
        toast.error('Error loading picture');
      });
    }
  }, [blog]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading blog: {error.message}</div>;
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <div className="card">
      <div className="card-body">
      <button 
          className="back-button" 
          onClick={() => navigate(-1)}
          title="Go back"
        >
          <FaArrowLeft />
        </button>
        <h1 className="card-title">{blog.title}</h1>
        <img src={picture} alt={blog.title} className="card-img-top" />
        <div className="card-meta">
          <span>Posted by {blog.author} on {blog.createdDate}</span>
        </div>
        <pre style={{ whiteSpace: 'pre-wrap', width: '', textAlign: 'left' }}>
          {blog.content}
        </pre>
      </div>
    </div>
  );
};

export default BlogDetail;