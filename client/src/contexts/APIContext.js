import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInt from '../config/axiosConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase/config';

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

  const createPost = async (content, images, mediaType) => {
    try {
      let imageUrls = [];
      
      if (mediaType === 'image') {
        if (Array.isArray(images) && images.length > 0) {
          // Check if the array contains file objects or URLs
          if (typeof images[0] === 'string') {
            // Handle array of URLs (from imageUrl input)
            imageUrls = images;
          } else {
            // Handle array of files (from multiple file upload)
            imageUrls = await uploadMultipleImages(images);
          }
        } else if (images) {
          // Handle legacy single image case
          const url = typeof images === 'string' ? images : await uploadImage(images);
          imageUrls = [url];
        }
      } else if (mediaType === 'video') {
        // For video, it's still a single URL
        imageUrls = typeof images === 'string' ? [images] : images;
      }
      
      // For backward compatibility, use the first image as the main image
      const mainImage = imageUrls.length > 0 ? imageUrls[0] : null;
      
      // Send to backend
      const response = await axiosInt.post('/createPost', { 
        content, 
        image: mainImage, // For backward compatibility
        images: imageUrls,
        mediaType 
      });
      
      return response;
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await axiosInt.post('/deletePost', { postId });
      return response;
    } catch (error) {
      console.error('Failed to delete post', error);
    }
  }

  const likePost = async (postId) => {
    try {
      const response = await axiosInt.post('/likePost', { postId });
      return response;
    } catch (error) {
      console.error('Failed to like post', error);
    }
  };

  const addComment = async (postId, text) => {
    try {
      const response = await axiosInt.post('/addComment', { postId, text });
      return response;
    } catch (error) {
      console.error('Failed to add comment', error);
    }
  };

  const uploadImage = async (file) => {
    try {
      // Create a unique file path
      const timestamp = Date.now();
      const storageRef = ref(storage, `uploads/${timestamp}_${file.name}`);

      // Upload the file directly to Firebase Storage
      const snapshot = await uploadBytes(storageRef, file);
      console.log('Uploaded a file!', snapshot);

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const uploadMultipleImages = async (files) => {
    try {
      // Upload multiple files in parallel and return array of URLs
      const uploadPromises = Array.isArray(files) 
        ? files.map(file => uploadImage(file))
        : [uploadImage(files)];
      
      return Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw error;
    }
  };

  const saveExternalImage = async (imageUrl) => {
    try {
      // Skip if already a Firebase URL
      if (imageUrl.includes('firebasestorage.googleapis.com')) {
        return imageUrl;
      }
      
      console.log('Processing external image:', imageUrl);
      
      // Fetch the image
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      
      // Get the image as a blob
      const blob = await response.blob();
      
      // Create a File object from the blob
      const fileExtension = imageUrl.split('.').pop().split('?')[0] || 'jpg';
      const filename = `external_${Date.now()}.${fileExtension}`;
      const file = new File([blob], filename, { type: blob.type });
      
      // Upload using your existing uploadImage function
      return await uploadImage(file);
    } catch (error) {
      console.error('Error processing external image:', error);
      // Return original URL as fallback
      return imageUrl;
    }
  };

  return (
    <APIContext.Provider value={{ fetchPosts, createPost, deletePost, likePost, addComment, refresh, setRefresh, uploadImage, uploadMultipleImages, saveExternalImage }}>
      {children}
    </APIContext.Provider>
  );
};
