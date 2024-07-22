import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { useAPI } from '../../contexts/APIContext';

function PostModal({ onClose }) {
  const { createPost } = useAPI();
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPost(content, image);
    onClose();
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
            value={image}
            onChange={(e) => setImage(e.target.value)}
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
