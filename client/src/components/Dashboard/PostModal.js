import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Switch, FormControlLabel } from '@mui/material';
import { useAPI } from '../../contexts/APIContext';

function PostModal({ onClose, onPostCreated }) {
  const { createPost, uploadImage } = useAPI();
  const [content, setContent] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [useImageURL, setUseImageURL] = useState(false); // State to toggle between URL and file input

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = imageURL;

    if (!useImageURL && imageFile) {
      try {
        imageUrl = await uploadImage(imageFile);
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

  const handleSwitchChange = () => {
    setUseImageURL(!useImageURL);
    setImageURL('');
    setImageFile(null);
  };

  return (
    <Modal open onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Create a Post
        </Typography>
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
          <FormControlLabel
            control={<Switch checked={useImageURL} onChange={handleSwitchChange} />}
            label="Use Image URL"
            sx={{ mt: 2, mb: 2 }}
          />
          {useImageURL ? (
            <TextField
              label="Image URL"
              variant="outlined"
              fullWidth
              margin="normal"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              size='small'
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ marginTop: '16px', marginBottom: '16px' }}
            />
          )}
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
  borderRadius: '16px', // Add rounded corners
  boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)', // Add 3D shadow effect
};

export default PostModal;
