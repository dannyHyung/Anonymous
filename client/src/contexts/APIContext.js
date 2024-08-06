import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInt from '../config/axiosConfig';

// Create a context for the API
const APIContext = createContext();

// Custom hook to use the API context
export const useAPI = () => useContext(APIContext);

// API Provider component
export const APIProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await axiosInt.get('/getPosts');
      return response
    } catch (error) {
      console.error('Failed to fetch posts', error);
    }
  };

  const createPost = async (content, image) => {
    try {
      const response = await axiosInt.post('/createPost', { content, image });
      setRefresh(true);
      return response
    } catch (error) {
      console.error('Failed to create post', error);
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await axiosInt.post('/deletePost', {postId});
      setRefresh(true);
      return response;
    } catch (error) {
      console.error('Failed to delete post', error);
    }
  }

  const likePost = async (postId) => {
    try {
      const response = await axiosInt.post('/likePost', { postId });
      setRefresh(true);
      return response;
    } catch (error) {
      console.error('Failed to like post', error);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInt.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.url; // Assuming the backend returns the URL of the uploaded file
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  return (
    <APIContext.Provider value={{ fetchPosts, createPost, deletePost, likePost, refresh, setRefresh, uploadFile }}>
      {children}
    </APIContext.Provider>
  );
};
