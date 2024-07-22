import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a context for the API
const APIContext = createContext();

// Custom hook to use the API context
export const useAPI = () => useContext(APIContext);

// API Provider component
export const APIProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts', error);
    }
  };

  const createPost = async (content, image) => {
    try {
      await axios.post('/api/posts', { content, image });
      fetchPosts();
    } catch (error) {
      console.error('Failed to create post', error);
    }
  };

  return (
    <APIContext.Provider value={{ posts, fetchPosts, createPost }}>
      {children}
    </APIContext.Provider>
  );
};
