import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/BlogDetail.css'
import toast from 'react-hot-toast';
import Spinner from './Spinner';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const [picture, setPicture] = useState('');

  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])
  
  useEffect(() => {
    axios.get(`http://localhost:8080/blog/getblog/${id}`)
      .then(response => {
        setBlog(response.data);
      })
      .catch(error => {
        setError(error);
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

  if (error) {
    return <div>Error loading blog: {error.message}</div>;
  }

  if (!blog) {
    return <Spinner />
  }

  return (
    <div className="card">
      <div className="card-body">
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