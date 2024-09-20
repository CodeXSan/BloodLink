import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router'
const CreateBlog = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('file', file);

            const response = await axios.post('http://localhost:8080/admin/blog/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate("/dashboard/blogs")
        } catch (error) {
            console.error('Error creating blog:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Create Blog</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="content" className="form-label">Content</label>
                    <textarea 
                        className="form-control" 
                        id="content" 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        rows="10" 
                        required
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="file" className="form-label">Upload File</label>
                    <input 
                        type="file" 
                        className="form-control" 
                        id="file" 
                        onChange={handleFileChange} 
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-primary">Create Blog</button>
            </form>
        </div>
    );
};

export default CreateBlog;
