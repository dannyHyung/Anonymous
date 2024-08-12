import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography, Box, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { useAPI } from '../../contexts/APIContext';

function CommentModal({ open, handleClose, postId, initialComments, onCommentAdded }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const { addComment } = useAPI();

  useEffect(() => {
    setComments(Array.isArray(initialComments) ? initialComments : []);
  }, [initialComments]);

  const handleAddComment = async () => {
    if (comment.trim()) {
      const newComment = await addComment(postId, comment);
      setComments([newComment.data, ...comments]);
      onCommentAdded(newComment.data); // Update parent component
      setComment('');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: '16px', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)' } }}>
      <DialogTitle>{"Comments"}</DialogTitle>
      <DialogContent>
        <Box>
        <IconButton
            aria-label="cancel"
            onClick={handleClose}
            sx={{ position: 'absolute', top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>
          {Object.keys(comments).length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              No comments yet. Be the first to comment!
            </Typography>
          ) : (
            comments.map((comment, index) => (
              <Box key={index} mb={2}>
                <Typography variant="body2" color="textSecondary">
                  {new Date(comment.date).toLocaleString()}
                </Typography>
                <Typography variant="body1" color="textPrimary">
                  {comment.text}
                </Typography>
              </Box>
            ))
          )}
        </Box>
        <Box display="flex" alignItems="center" mt={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <IconButton color="primary" onClick={handleAddComment}>
            <SendIcon />
          </IconButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default CommentModal;
