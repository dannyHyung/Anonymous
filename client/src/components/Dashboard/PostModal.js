import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, ImageList, ImageListItem, CircularProgress, Backdrop } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ClearIcon from '@mui/icons-material/Clear';
import { getYoutubeVideoId } from '../../utils/videoUtils';
import { useAPI } from '../../contexts/APIContext';

function PostModal({ onClose, onPostCreated }) {
  const { uploadImage, saveExternalImage } = useAPI();
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState('none');
  const [imageURL, setImageURL] = useState('');
  const [videoURL, setVideoURL] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]); // Changed to array
  const [previewURLs, setPreviewURLs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Attachment menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Create object URLs for file previews
  useEffect(() => {
    if (imageFiles.length > 0) {
      const objectUrls = imageFiles.map(file => URL.createObjectURL(file));
      setPreviewURLs(objectUrls);

      // Clean up on unmount
      return () => objectUrls.forEach(url => URL.revokeObjectURL(url));
    }
  }, [imageFiles]);

  const handleAttachClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMediaSelect = (type) => {
    setMediaType(type);
    handleClose();
    // Clear preview when changing media type
    if (type !== 'image') {
      setPreviewURLs([]); // Changed to empty array
      setImageFiles([]); // Also clear image files
    }
  };

  const clearMedia = () => {
    setMediaType('none');
    setImageFiles([]);
    setImageURL('');
    setVideoURL('');
    setPreviewURLs([]);
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      // Limit to 10 images total
      const newFiles = [...imageFiles, ...filesArray];
      if (newFiles.length > 10) {
        alert("Maximum 10 images allowed. Some images were not added.");
        const limitedNewFiles = newFiles.slice(0, 10);
        setImageFiles(limitedNewFiles);
      } else {
        setImageFiles(newFiles);
      }
    }
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewURLs(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      if (mediaType === 'imageUrl') {
        // Single URL upload
        const savedUrl = await saveExternalImage(imageURL);
        await onPostCreated(content, [savedUrl], 'image'); // Pass as array for consistency
      } else if (mediaType === 'videoUrl') {
        // Video URL
        await onPostCreated(content, videoURL, 'video');
      } else if (mediaType === 'image' && imageFiles.length > 0) {
        // Multiple image files
        await onPostCreated(content, imageFiles, 'image');
      } else {
        // Text-only post
        await onPostCreated(content, [], 'none');
      }

      onClose();
    } catch (error) {
      console.error('Failed to create post:', error);
      setIsLoading(false); // Stop loading on error
    }
  };

  const renderImagePreviews = () => (
    <Box sx={{ mb: 2 }}>
      <ImageList sx={{ width: '100%', maxHeight: 300 }} cols={3} rowHeight={100}>
        {previewURLs.map((url, index) => (
          <ImageListItem key={index} sx={{ position: 'relative' }}>
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              loading="lazy"
              style={{
                height: '100px',
                width: '100%',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
            <IconButton
              size="small"
              onClick={() => removeImage(index)}
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                backgroundColor: 'rgba(0,0,0,0.4)',
                '&:hover': {
                  backgroundColor: 'rgba(255,0,0,0.2)',
                },
                padding: '2px'
              }}
            >
              <ClearIcon fontSize="small" sx={{ color: '#fff' }} />
            </IconButton>
          </ImageListItem>
        ))}
      </ImageList>
      <Typography sx={{ mt: 1, color: '#0080ff', fontWeight: 500 }}>
        {imageFiles.length} {imageFiles.length === 1 ? 'image' : 'images'} selected ({imageFiles.length}/10)
      </Typography>
    </Box>
  );

  // Check if we have at least one form of content (text or media)
  const hasContent = content.trim() ||
    (mediaType === 'image' && imageFiles.length > 0) ||
    (mediaType === 'imageUrl' && imageURL.trim()) ||
    (mediaType === 'videoUrl' && videoURL.trim());

  return (
    <Modal open onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        maxWidth: '90vw',
        bgcolor: '#262626',
        color: '#fff',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            padding: '16px 24px',
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
            Create a Post
          </Typography>
          <IconButton
            onClick={onClose}
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

        {/* Form Content */}
        <Box sx={{ padding: '24px' }}>
          <form onSubmit={handleSubmit}>
            <TextField
              placeholder="What's on your mind?"
              multiline
              rows={4}
              fullWidth
              value={content}
              onChange={(e) => setContent(e.target.value)}
              sx={{
                mb: 3,
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
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255,255,255,0.7)',
                  opacity: 1,
                },
              }}
              InputProps={{
                sx: {
                  padding: '16px',
                  fontSize: '1rem',
                  fontFamily: "'Inter', 'Roboto', sans-serif",
                }
              }}
            />

            {/* Media Preview Area - shown only when media is selected */}
            {mediaType !== 'none' && (
              <Box
                sx={{
                  mt: 2,
                  mb: 3,
                  position: 'relative',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
                  <IconButton
                    size="small"
                    onClick={clearMedia}
                    sx={{
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255,0,0,0.2)',
                        transform: 'rotate(90deg)'
                      }
                    }}
                  >
                    <ClearIcon fontSize="small" sx={{ color: '#fff' }} />
                  </IconButton>
                </Box>

                {/* Content based on media type */}
                {mediaType === 'image' && (
                  <Box sx={{ textAlign: 'center' }}>
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />

                    {previewURLs.length > 0 && renderImagePreviews()}

                    {previewURLs.length < 10 && (
                      <Box
                        onClick={() => document.getElementById('file-input').click()}
                        sx={{
                          border: '2px dashed rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          padding: previewURLs.length > 0 ? '15px' : '30px 20px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: '#0080ff',
                            backgroundColor: 'rgba(0,128,255,0.05)',
                          },
                          textAlign: 'center'
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <ImageIcon sx={{ fontSize: previewURLs.length > 0 ? 30 : 40, color: 'rgba(255,255,255,0.5)', mb: 1 }} />
                          <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            {previewURLs.length > 0 ? 'Click to add more images' : 'Click to select up to 10 images'}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}

                {mediaType === 'imageUrl' && (
                  <Box>
                    <TextField
                      placeholder="Enter image URL"
                      fullWidth
                      value={imageURL}
                      onChange={(e) => setImageURL(e.target.value)}
                      sx={{
                        mb: imageURL ? 2 : 0,
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
                        },
                      }}
                    />

                    {/* Image URL preview */}
                    {imageURL && (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          mt: 2,
                          position: 'relative'
                        }}
                      >
                        <img
                          src={imageURL}
                          alt="Preview"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0yNCAyNGgtMjR2LTI0aDI0djI0em0tMS0yM2gtMjJ2MjJoMjJ2LTIyem0tMTYuNSAxMmwtMy41LTMuNSA3LTcgOCA4LTEuNSAxLjUtNi41LTYuNS01IDV6Ii8+PC9zdmc+';
                            e.target.style.width = '80px';
                            e.target.style.height = '80px';
                            e.target.style.opacity = '0.5';
                          }}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '200px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                )}

                {mediaType === 'videoUrl' && (
                  <Box>
                    <TextField
                      placeholder="Enter YouTube video URL"
                      fullWidth
                      value={videoURL}
                      onChange={(e) => setVideoURL(e.target.value)}
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
                        },
                      }}
                    />
                    {videoURL && getYoutubeVideoId(videoURL) && (
                      <Box
                        sx={{
                          position: 'relative',
                          paddingTop: '56.25%', // 16:9 aspect ratio
                          borderRadius: '8px',
                          overflow: 'hidden',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
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
                          src={`https://www.youtube.com/embed/${getYoutubeVideoId(videoURL)}`}
                          title="YouTube video"
                          allowFullScreen
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            )}

            {/* Action Bar */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2
              }}
            >
              {/* Attachment button */}
              <IconButton
                onClick={handleAttachClick}
                disabled={mediaType !== 'none'}
                sx={{
                  color: mediaType === 'none' ? '#0080ff' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(0,128,255,0.1)',
                    transform: mediaType === 'none' ? 'scale(1.1)' : 'none'
                  }
                }}
              >
                <AttachFileIcon /> 
              </IconButton>

              {/* Attachment Menu */}
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    backgroundColor: '#333',
                    color: '#fff',
                    borderRadius: '10px',
                    mt: 1,
                    boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                  }
                }}
              >
                <MenuItem onClick={() => handleMediaSelect('image')}>
                  <ListItemIcon>
                    <ImageIcon sx={{ color: '#0080ff' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Upload Image"
                    primaryTypographyProps={{
                      sx: { fontFamily: "'Inter', 'Roboto', sans-serif" }
                    }}
                  />
                </MenuItem>
                <MenuItem onClick={() => handleMediaSelect('imageUrl')}>
                  <ListItemIcon>
                    <LinkIcon sx={{ color: '#0080ff' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Image URL"
                    primaryTypographyProps={{
                      sx: { fontFamily: "'Inter', 'Roboto', sans-serif" }
                    }}
                  />
                </MenuItem>
                <MenuItem onClick={() => handleMediaSelect('videoUrl')}>
                  <ListItemIcon>
                    <YouTubeIcon sx={{ color: '#ff0000' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="YouTube Video"
                    primaryTypographyProps={{
                      sx: { fontFamily: "'Inter', 'Roboto', sans-serif" }
                    }}
                  />
                </MenuItem>
              </Menu>

              {/* Buttons */}
              <Box display="flex" gap={2}>
                <Button
                  onClick={onClose}
                  disabled={isLoading}
                  sx={{
                    textTransform: 'none',
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: "'Inter', 'Roboto', sans-serif",
                    '&:hover': {
                      color: '#fff',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!hasContent || isLoading}
                  sx={{
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
                    color: '#fff',
                    fontWeight: 600,
                    fontFamily: "'Inter', 'Roboto', sans-serif",
                    padding: '8px 24px',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #0072ff, #4700ff)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 10px rgba(0,114,255,0.3)',
                    },
                    '&:disabled': {
                      background: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.3)',
                    }
                  }}
                >
                  {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                      Posting...
                    </Box>
                  ) : (
                    'Post'
                  )}
                </Button>
              </Box>
              {/* Add a loading overlay */}
              <Backdrop
                sx={{
                  position: 'absolute',
                  color: '#fff',
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}
                open={isLoading}
              >
                <CircularProgress color="primary" />
                <Typography variant="body1">
                  {mediaType === 'image' && imageFiles.length > 0
                    ? `Uploading ${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''}...`
                    : 'Creating your post...'}
                </Typography>
              </Backdrop>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
}

export default PostModal;