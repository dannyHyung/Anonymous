import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { useAPI } from '../../contexts/APIContext';

function Post({ id, content, image, date, likes, comments, onLike, onDelete }) {
  const { deletePost } = useAPI(); // Assuming deletePost is implemented in the API context
  const [open, setOpen] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);

  const handleLike = async () => {
    await onLike(id);
    setCurrentLikes(currentLikes + 1);
  };

  const handleDeleteClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = async () => {
    // await deletePost(id);
    await onDelete(id);
    handleClose();
  };

  return (
    <Box sx={{ maxWidth: { xs: 300, sm: 400, md: 600 }, width: '100%', margin: '0 auto', mb: 3 }}>
      <Card sx={{ width: '100%', position: 'relative' }}>
        <CardContent sx={{ }}>
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
            <Box display="flex" alignItems="center">
              <IconButton onClick={handleLike} color="black">
                <WhatshotIcon />
              </IconButton>
              <IconButton onClick={() => console.log('Comment clicked')} color="black">
                <ChatBubbleIcon />
              </IconButton>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" color="textSecondary" sx={{ marginRight: 2 }}>
                  {likes} likes
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {Object.keys(comments).length} comments
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Posted on: {new Date(date).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)',
          }
        }}
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
