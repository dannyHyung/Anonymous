import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInt from '../config/axiosConfig';

// Create a context for the API
const APIContext = createContext();

// Custom hook to use the API context
export const useAPI = () => useContext(APIContext);

// API Provider component
export const APIProvider = ({ children }) => {

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
      const response = await axiosInt.post('/createPosts', { content, image });
      return response
    } catch (error) {
      console.error('Failed to create post', error);
    }
  };

  return (
    <APIContext.Provider value={{ fetchPosts, createPost }}>
      {children}
    </APIContext.Provider>
  );
};
