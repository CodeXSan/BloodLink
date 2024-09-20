import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Blog.css';
import useAuth from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Modal, Button } from 'react-bootstrap';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [images, setImages] = useState({});
  const [auth] = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:8080/blog/getblog');
      setBlogs(response.data);
    } catch (error) {
      console.error('There was an error fetching the blog data!', error);
    }
  };

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

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/admin/blog/delete/${selectedBlogId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchBlogs();
      setShowModal(false);
    } catch (error) {
      toast.error(`Error deleting blog with id ${selectedBlogId}`, error);
    }
  };

  const handleEdit = (id) => {
    window.location.href = `/dashboard/editblog/${id}`;
  };

  const openModal = (id) => {
    setSelectedBlogId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="blog-container">
      <h1>All Blog</h1>
      <div className="blog-grid">
        {blogs.map(blog => (
          <div key={blog.id} className="blog-card">
            <img src={images[blog.id]} alt={blog.title} className="blog-image" />
            <div className="blog-content">
              <h2 className="blog-title">{blog.title}</h2>
              <p className="blog-excerpt">{blog.content.substring(0, 200)}...</p>
              <Link to={`/dashboard/blog/${blog.id}`} className="read-more">Read More</Link>
              <button 
                className="btn btn-danger delete-button" 
                onClick={() => openModal(blog.id)}
              >
                Delete
              </button>
              <button 
                className="btn btn-primary edit-button" 
                onClick={() => handleEdit(blog.id)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this blog?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Blog;
