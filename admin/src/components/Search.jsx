import React, { useState } from 'react';
import axios from 'axios';
import useAuth from '../contexts/AuthContext';

const Search = ({ onSearchResults }) => {
    const [auth] = useAuth()
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:8080/admin/search', {
                params: {
                    query: searchTerm
                },
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            onSearchResults(response.data);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    return (
        <div className="search-box">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default Search;
