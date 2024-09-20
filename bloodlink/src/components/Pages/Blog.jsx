import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Blog.css';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [images, setImages] = useState({});

  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])
  useEffect(() => {
    axios.get('http://localhost:8080/blog/getblog')
      .then(response => {
        setBlogs(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the blog data!', error);
      });
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      for (const blog of blogs) {
        try {
          const response = await axios.get(`http://localhost:8080/blog/getblog/photo/${blog.photoUrl}`, {
            responseType: 'arraybuffer',
          });
          const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
          const imageUrl = URL.createObjectURL(imageBlob);
          setImages(prevImages => ({ ...prevImages, [blog.id]: imageUrl }));
        } catch (error) {
          console.error(`Error fetching image for blog ${blog.id}`, error);
        }
      }
    };
    fetchImages();
  }, [blogs]);

  return (
    <div className="blog-container">
      <h1>Blog</h1>
      <p>Blood donation has been prevalent for ages, however it is always a challenge to find the right donor at the right time. Blood donation through the years has become easier.</p>
      <div className="blog-grid">
        {blogs.slice(0,3).map(blog => (  
          <div key={blog.id} className="blog-card">
            <img src={images[blog.id]} alt={blog.title} className="blog-image" />
            <div className="blog-content">
              <h2 className="blog-title">{blog.title}</h2>
              <p className="blog-excerpt">{blog.content.substring(0, 200)}...</p>
              <Link to={`/blog/${blog.id}`} className="read-more">Read More</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;