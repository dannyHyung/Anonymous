import React, { useState } from 'react';
import {
  Card, CardContent, CardMedia, Typography, Box, IconButton, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle, Button,
  MobileStepper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views'; // Need to install this package
import CommentModal from './CommentModal';
import AddCommentIcon from '@mui/icons-material/AddComment';
import formatDate from '../../utils/dateFormatter';
import { getYoutubeVideoId } from '../../utils/videoUtils'
import { useAPI } from '../../contexts/APIContext';

function Post({ id, content, image, images = [], mediaType = 'image', date, likes, comments, onLike, onDelete, isAuthenticated, onAuthNeeded, currentUserId, postUserId }) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [currentComments, setCurrentComments] = useState(Array.isArray(comments) ? comments : []);
  const [activeStep, setActiveStep] = useState(0);

  const checkAuth = () => {
    if (!isAuthenticated) {
      onAuthNeeded();
      return false;
    }
    return true;
  };

  // Process images array - use provided images array or create from single image
  const allImages = images && images.length > 0 ? images : (image ? [image] : []);
  const maxSteps = allImages.length;

  // Handle carousel navigation
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const handleLike = async () => {
    if (!checkAuth()) return;

    const updatedPost = await onLike(id);
    if (updatedPost) {
      setCurrentLikes(updatedPost.likes);
    }
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await onDelete(id);
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
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

  const renderMediaContent = () => {
    if (mediaType === 'video') {
      // Video rendering code remains the same
      return (
        <Box
          sx={{
            position: 'relative',
            paddingTop: '56.25%',
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
      );
    }

    // If we have images to show
    if (allImages.length > 0) {
      return (
        <Box sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '8px',
          marginTop: '16px',
          backgroundColor: '#121212',
        }}>
          <SwipeableViews
            axis="x"
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
          >
            {allImages.map((img, index) => (
              <Box key={index} sx={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CardMedia
                  component="img"
                  image={img}
                  alt={`Post image ${index + 1}`}
                  sx={{
                    maxHeight: '400px',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    backgroundColor: '#121212',
                  }}
                />
              </Box>
            ))}
          </SwipeableViews>

          {/* Only show navigation if we have multiple images */}
          {maxSteps > 1 && (
            <>
              {/* Navigation arrows */}
              {activeStep > 0 && (
                <IconButton
                  onClick={handleBack}
                  sx={{
                    position: 'absolute',
                    left: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#fff',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
                  }}
                >
                  <KeyboardArrowLeft />
                </IconButton>
              )}

              {activeStep < maxSteps - 1 && (
                <IconButton
                  onClick={handleNext}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#fff',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
                  }}
                >
                  <KeyboardArrowRight />
                </IconButton>
              )}

              {/* Image counter */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: '#fff',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem'
                }}
              >
                {activeStep + 1} / {maxSteps}
              </Box>

              {/* Dot indicators */}
              <MobileStepper
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  backgroundColor: 'transparent',
                  '& .MuiMobileStepper-dot': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    margin: '0 4px',
                  },
                  '& .MuiMobileStepper-dotActive': {
                    backgroundColor: '#fff',
                  }
                }}
                nextButton={<div />}
                backButton={<div />}
              />
            </>
          )}
        </Box>
      );
    }

    return null;
  };

  return (
    <Box sx={{
      maxWidth: { xs: '100%', sm: 400, md: 600 }, // Full width on mobile
      width: '100%',
      margin: '0 auto',
      mb: { xs: 2, sm: 3 }, // Less margin on mobile
      minHeight: { xs: '180px', sm: '200px' }, // Smaller minimum height on mobile
      transition: 'transform 0.3s ease',
    }}>
      <Card sx={{
        width: '100%',
        position: 'relative',
        minHeight: { xs: '180px', sm: '200px' }, // Smaller minimum height on mobile
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#262626',
        borderRadius: { xs: '8px', sm: '12px' }, // Smaller radius on mobile
        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        border: '1px solid #333'
      }}>
        <CardContent sx={{
          flexGrow: 1,
          padding: { xs: '15px', sm: '20px' }, // Less padding on mobile
          position: 'relative',
        }}>
          {isAuthenticated && currentUserId === postUserId && (
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
          )}

          <Box sx={{
            paddingRight: '40px',
            overflowWrap: 'break-word'
          }}>
            <Typography
              variant="body1"
              sx={{
                color: '#fff',
                fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1.05rem' }, // Smaller font on mobile
                lineHeight: { xs: 1.5, sm: 1.7 }, // Tighter line height on mobile
                letterSpacing: '0.01em',
                fontFamily: "'Inter', 'Roboto', sans-serif",
                fontWeight: 400,
                marginBottom: { xs: '12px', sm: '16px' }, // Less margin on mobile
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

          {renderMediaContent()}
        </CardContent>
        <Box sx={{
          padding: { xs: '8px 8px 12px', sm: '12px 12px 16px' }, // Less padding on mobile
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-end"
          >
            {/* Left section: Icons and counts */}
            <Box display="flex" alignItems="center" gap={{ xs: 0.5, sm: 1 }}> {/* Reduced gap on mobile */}
              {/* Like button with count */}
              <Box display="flex" alignItems="center">
                <IconButton
                  onClick={handleLike}
                  sx={{
                    p: { xs: 0.3, sm: 0.5, md: 0.75 }, // Less padding on mobile
                    color: '#fff',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#ff3b30',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <WhatshotIcon sx={{ fontSize: { xs: '22px', sm: '28px' } }} /> {/* Smaller on mobile */}
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    fontWeight: 500,
                    fontSize: { xs: '0.85rem', sm: '0.95rem' }, // Smaller font on mobile
                    position: 'relative',
                    top: '1px'
                  }}
                >
                  {currentLikes}
                </Typography>
              </Box>

              {/* Comment button with count */}
              <Box display="flex" alignItems="center">
                <IconButton
                  onClick={handleCommentClick}
                  sx={{
                    p: { xs: 0.3, sm: 0.5, md: 0.75 }, // Less padding on mobile
                    color: '#fff',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#0080ff',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <svg
                    width={window.innerWidth < 600 ? "22" : "28"} // Dynamic SVG sizing
                    height={window.innerWidth < 600 ? "22" : "28"}
                    viewBox="0 0 32 32"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M25.784,21.017C26.581,19.467,27,17.741,27,16c0-6.065-4.935-11-11-11S5,9.935,5,16s4.935,11,11,11   c1.742,0,3.468-0.419,5.018-1.215l4.74,1.185C25.838,26.99,25.919,27,26,27c0.262,0,0.518-0.103,0.707-0.293   c0.248-0.249,0.349-0.609,0.263-0.95L25.784,21.017z M23.751,21.127l0.874,3.498l-3.498-0.875   c-0.247-0.061-0.509-0.026-0.731,0.098C19.055,24.602,17.534,25,16,25c-4.963,0-9-4.038-9-9s4.037-9,9-9s9,4.038,9,9   c0,1.534-0.398,3.054-1.151,4.395C23.724,20.618,23.688,20.88,23.751,21.127z" />
                  </svg>
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    fontWeight: 500,
                    fontSize: { xs: '0.85rem', sm: '0.95rem' }, // Smaller font on mobile
                    position: 'relative',
                    top: '1px'
                  }}
                >
                  {currentComments.length}
                </Typography>
              </Box>
            </Box>

            {/* Right section: Date */}
            <Typography
              variant="body2"
              noWrap
              sx={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' }, // Smaller on mobile
                alignSelf: 'flex-end',
                ml: { xs: 1, sm: 2 } // Ensure some margin from the buttons
              }}
            >
              {date && formatDate(date)}
            </Typography>
          </Box>
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
        isAuthenticated={isAuthenticated}
        onAuthNeeded={onAuthNeeded}
      />
    </Box>
  );
}

export default Post;
