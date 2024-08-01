import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { useAPI } from '../../contexts/APIContext';

function PostModal({ onClose, onPostCreated }) {
  const { createPost, uploadFile } = useAPI();
  const [content, setContent] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = imageURL;

    if (imageFile) {
      try {
        imageUrl = await uploadFile(imageFile);
      } catch (error) {
        console.error('Failed to upload image:', error);
        // Optionally show an error message to the user
        return;
      }
    }

    await onPostCreated(content, imageUrl);
    onClose();
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  return (
    <Modal open onClose={onClose}>
      <Box sx={{ ...modalStyle }}>
        <Typography variant="h6" component="h2">Create a Post</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="What's on your mind?"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            margin="normal"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <TextField
            label="Image URL (optional)"
            variant="outlined"
            fullWidth
            margin="normal"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={onClose} variant="contained" color="secondary">Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Post</Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default PostModal;
