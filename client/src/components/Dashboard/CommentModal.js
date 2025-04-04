import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, TextField, Typography, Box, IconButton, Avatar, Button } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import formatDate from '../../utils/dateFormatter';
import { useAPI } from '../../contexts/APIContext';

function CommentModal({ open, handleClose, postId, initialComments, onCommentAdded, isAuthenticated, onAuthNeeded }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const { addComment } = useAPI();

  useEffect(() => {
    setComments(Array.isArray(initialComments) ? initialComments : []);
  }, [initialComments]);

  const handleAddComment = async () => {
    if (!isAuthenticated) {
      onAuthNeeded();
      return;
    }

    if (comment.trim()) {
      const newComment = await addComment(postId, comment);
      setComments([newComment.data, ...comments]);
      onCommentAdded(newComment.data);
      setComment('');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={false}
      maxWidth="xs"
      PaperProps={{
        sx: {
          backgroundColor: '#262626',
          color: '#fff',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          width: '400px',
          maxWidth: '90vw'
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#ffffff',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              backgroundImage: 'linear-gradient(45deg, #00c6ff, #0072ff, #0039ff, #4700ff, #9100ff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 10px rgba(0, 198, 255, 0.3)'
            }
          }}
        >
          Comments
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            color: 'rgba(255,255,255,0.7)',
            '&:hover': {
              color: '#fff',
              transform: 'rotate(90deg)',
              transition: 'all 0.3s ease'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Comment List */}
      <DialogContent sx={{
        padding: 0,
        maxHeight: '400px',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(0,0,0,0.1)',
        }
      }}>
        {comments.length === 0 ? (
          <Box sx={{
            padding: '30px 24px',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.5)'
          }}>
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
              No comments yet. {isAuthenticated ? 'Be the first to comment!' : 'Log in to be the first to comment!'}
            </Typography>
          </Box>
        ) : (
          comments.map((comment, index) => (
            <Box
              key={index}
              sx={{
                padding: '10px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.03)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                {/* Anonymous profile icon */}
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                  }}
                >
                  <PersonIcon fontSize="small" />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#fff',
                      fontSize: '0.95rem',
                      lineHeight: 1.4,
                      wordBreak: 'break-word'
                    }}
                  >
                    {comment.text}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: '0.75rem',
                      marginTop: '4px'
                    }}
                  >
                    {formatDate(comment.date)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </DialogContent>

      {/* Comment Input */}
      <Box
        sx={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          variant="outlined"
          disabled={isAuthenticated ? false : true}
          placeholder={isAuthenticated ? "Write a comment..." : "Log in first..."}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              color: '#fff',
              '& fieldset': {
                borderColor: 'rgba(255,255,255,0.1)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255,255,255,0.2)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#0080ff',
              },
              '&.Mui-disabled': {
                color: 'rgba(255,255,255,0.5)',
                backgroundColor: 'rgba(255,255,255,0.02)',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.05)',
                },
                '& textarea, & input': {
                  color: 'rgba(255,255,255,0.5)',
                  WebkitTextFillColor: 'rgba(255,255,255,0.5)', // Fixes Safari
                }
              },
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'rgba(255,255,255,0.5)',
              opacity: 1,
            },
          }}
          inputProps={{
            style: {
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
            }
          }}
        />
        <IconButton
          onClick={handleAddComment}
          disabled={!comment.trim()}
          sx={{
            backgroundColor: comment.trim() ? '#0080ff' : 'rgba(255,255,255,0.1)',
            color: comment.trim() ? '#fff' : 'rgba(255,255,255,0.3)',
            padding: '10px',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: comment.trim() ? '#0072ff' : 'rgba(255,255,255,0.1)',
              transform: comment.trim() ? 'translateY(-2px)' : 'none',
              boxShadow: comment.trim() ? '0 6px 10px rgba(0,114,255,0.3)' : 'none',
            }
          }}
        >
          <ArrowUpwardIcon />
        </IconButton>
      </Box>
    </Dialog>
  );
}

export default CommentModal;