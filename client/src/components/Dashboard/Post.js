import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CommentModal from './CommentModal';
import { useAPI } from '../../contexts/APIContext';

function Post({ id, content, image, date, likes, comments, onLike, onDelete }) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [currentComments, setCurrentComments] = useState(Array.isArray(comments) ? comments : []);

  const handleLike = async () => {
    await onLike(id);
    setCurrentLikes(currentLikes + 1);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    await onDelete(id);
    handleCloseDeleteDialog();
  };

  const handleCommentClick = () => {
    setOpenCommentModal(true);
  };

  const handleCloseCommentModal = () => {
    setOpenCommentModal(false);
  };

  const handleCommentAdded = (newComment) => {
    setCurrentComments([newComment, ...currentComments]);
  };

  return (
    <Box sx={{ maxWidth: { xs: 300, sm: 400, md: 600 }, width: '100%', margin: '0 auto', mb: 3, minHeight: '200px' }}>
      <Card sx={{ width: '100%', position: 'relative', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <CardContent sx={{ flexGrow: 1 }}>
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
              sx={{ maxHeight: '400px', objectFit: 'contain', width: '100%', marginTop: '16px' }}
            />
          )}
        </CardContent>
        <Box sx={{ padding: '8px 16px' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <IconButton onClick={handleLike} color="inherit" sx={{ marginRight: 1 }}>
                <WhatshotIcon />
              </IconButton>
              <IconButton onClick={handleCommentClick} color="inherit">
                <ChatBubbleIcon />
              </IconButton>
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
            <Box display="flex" alignItems="center">
              <Typography variant="body2" color="textSecondary" sx={{ marginRight: 1 }}>
                {currentLikes} likes
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {currentComments.length} comments
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary">
              Posted on: {new Date(date).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Card>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
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
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <CommentModal
        open={openCommentModal}
        handleClose={handleCloseCommentModal}
        postId={id}
        initialComments={Array.isArray(currentComments) ? currentComments : []}
        onCommentAdded={handleCommentAdded}
      />
    </Box>
  );
}

export default Post;
