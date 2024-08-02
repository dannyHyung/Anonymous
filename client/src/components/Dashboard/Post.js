import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAPI } from '../../contexts/APIContext';

function Post({ id, content, image, date }) {
  const { deletePost } = useAPI(); // Assuming deletePost is implemented in the API context
  const [open, setOpen] = useState(false);

  const handleDeleteClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = async () => {
    await deletePost(id);
    handleClose();
  };

  return (
    <Box sx={{ maxWidth: { xs: 300, sm: 400, md: 600 }, width: '100%', margin: '0 auto', mb: 3 }}>
      <Card sx={{ width: '100%', position: 'relative' }}>
        <CardContent>
          <IconButton
            aria-label="delete"
            onClick={handleDeleteClick}
            sx={{ position: 'absolute', top: 10, right: 10 }}
          >
            <DeleteIcon />
          </IconButton>
          <Typography variant="body1" color="textPrimary" component="p">
            {content}
          </Typography>
          {image && (
            <CardMedia
              component="img"
              image={image}
              alt="Post"
              sx={{ maxHeight: '400px', objectFit: 'contain', width: '100%' }}
            />
          )}
          <Box mt={2}>
            <Typography variant="body2" color="textSecondary">
              Posted on: {new Date(date).toLocaleString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Post;
