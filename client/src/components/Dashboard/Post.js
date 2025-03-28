import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Tooltip, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import CommentModal from './CommentModal';
import AddCommentIcon from '@mui/icons-material/AddComment';
import { getYoutubeVideoId } from '../../utils/videoUtils'
import { useAPI } from '../../contexts/APIContext';

function Post({ id, content, image, mediaType = 'image', date, likes, comments, onLike, onDelete }) {
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
    <Box sx={{
      maxWidth: { xs: 300, sm: 400, md: 600 },
      width: '100%',
      margin: '0 auto',
      mb: 3,
      minHeight: '200px',
      transition: 'transform 0.3s ease',
    }}>
      <Card sx={{
        width: '100%',
        position: 'relative',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#262626',
        borderRadius: '12px',
        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        border: '1px solid #333'
      }}>
        <CardContent sx={{
          flexGrow: 1,
          padding: '20px',
          position: 'relative',
        }}>
          <IconButton
            aria-label="delete"
            onClick={handleDeleteClick}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: '#aaa',
              zIndex: 10,
              '&:hover': {
                color: '#ff5252',
                transform: 'rotate(90deg)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            <DeleteIcon />
          </IconButton>

          <Box sx={{
            paddingRight: '40px',
            overflowWrap: 'break-word'
          }}>
            <Typography
              variant="body1"
              sx={{
                color: '#fff',
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.05rem' },
                lineHeight: 1.7,
                letterSpacing: '0.01em',
                fontFamily: "'Inter', 'Roboto', sans-serif",
                fontWeight: 400,
                marginBottom: '16px',
                textShadow: '0 1px 1px rgba(0,0,0,0.3)',
                '& strong': { fontWeight: 600, color: '#e0e0e0' },
                '& a': {
                  color: '#0080ff',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                },
              }}
            >
              {content}
            </Typography>
          </Box>

          {image && mediaType === 'image' && (
            <Box sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '8px',
              marginTop: '16px',
              '&:hover img': {
                transform: 'scale(1.03)',
              }
            }}>
              <CardMedia
                component="img"
                image={image}
                alt="Post"
                sx={{
                  maxHeight: '400px',
                  objectFit: 'contain',
                  width: '100%',
                  transition: 'transform 0.5s ease',
                  cursor: 'pointer'
                }}
              />
            </Box>
          )}
          {image && mediaType === 'video' && (
            <Box
              sx={{
                position: 'relative',
                paddingTop: '56.25%', // 16:9 aspect ratio
                marginTop: '16px',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'black'
              }}
            >
              <iframe
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                src={`https://www.youtube.com/embed/${getYoutubeVideoId(image)}`}
                title="YouTube video"
                allowFullScreen
              />
            </Box>
          )}
        </CardContent>
        <Box sx={{
          padding: '12px 20px 16px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Box display="flex" alignItems="center">
                <Tooltip title="Like" arrow placement="top">
                  <IconButton
                    onClick={handleLike}
                    sx={{
                      mr: 1,
                      color: '#fff',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        color: '#ff3b30',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <WhatshotIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Comment" arrow placement="top">
                  <IconButton
                    onClick={handleCommentClick}
                    sx={{
                      color: '#fff',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        color: '#0080ff',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <AddCommentIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>

          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    fontWeight: 500
                  }}
                >
                  {currentLikes} likes
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    fontWeight: 500
                  }}
                >
                  {currentComments.length} comments
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box display="flex" alignItems="center" mt={1}>
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '0.75rem'
                  }}
                >
                  Posted on:{' '}
                  {date && date._seconds
                    ? new Date(date._seconds * 1000).toLocaleString()
                    : new Date(date).toLocaleString()}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            backgroundColor: '#2d2d2d',
            color: '#fff',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff' }}>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{
              color: 'rgba(255,255,255,0.7)',
              '&:hover': { color: '#fff' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            sx={{
              background: 'linear-gradient(45deg, #ff5252, #ff1744)',
              color: '#fff',
              '&:hover': {
                background: 'linear-gradient(45deg, #ff1744, #d50000)',
              }
            }}
            autoFocus
          >
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
