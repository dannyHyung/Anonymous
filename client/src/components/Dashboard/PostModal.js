import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Switch, FormControlLabel, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import { useAPI } from '../../contexts/APIContext';

function PostModal({ onClose, onPostCreated }) {
  const { createPost, uploadImage } = useAPI();
  const [content, setContent] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [useImageURL, setUseImageURL] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = imageURL;

    if (!useImageURL && imageFile) {
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (error) {
        console.error('Failed to upload image:', error);
        return;
      }
    }

    await onPostCreated(content, imageUrl);
    onClose();
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleSwitchChange = () => {
    setUseImageURL(!useImageURL);
    setImageURL('');
    setImageFile(null);
    setFileName('');
  };

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
              required
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
            
            {/* Image Type Selector */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 2,
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '8px 16px',
              }}
            >
              <Box display="flex" alignItems="center">
                {useImageURL ? (
                  <LinkIcon sx={{ color: '#0080ff', mr: 1 }} />
                ) : (
                  <ImageIcon sx={{ color: '#0080ff', mr: 1 }} />
                )}
                <Typography>
                  {useImageURL ? 'Image URL' : 'Upload Image'}
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch 
                    checked={useImageURL} 
                    onChange={handleSwitchChange}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#0080ff',
                        '&:hover': {
                          backgroundColor: 'rgba(0,128,255,0.1)',
                        },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#0080ff',
                      },
                    }}
                  />
                }
                label=""
              />
            </Box>
            
            {/* URL or File Input */}
            {useImageURL ? (
              <TextField
                placeholder="Enter image URL"
                fullWidth
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
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
                }}
              />
            ) : (
              <Box
                sx={{
                  mb: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#0080ff',
                    backgroundColor: 'rgba(0,128,255,0.05)',
                  }
                }}
                onClick={() => document.getElementById('file-input').click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                {fileName ? (
                  <Typography sx={{ color: '#0080ff' }}>
                    {fileName}
                  </Typography>
                ) : (
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    Click to select an image
                  </Typography>
                )}
              </Box>
            )}
            
            {/* Buttons */}
            <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
              <Button 
                onClick={onClose} 
                sx={{
                  textTransform: 'none',
                  color: 'rgba(255,255,255,0.7)',
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
                disabled={!content.trim()}
                sx={{
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
                  color: '#fff',
                  fontWeight: 600,
                  padding: '8px 24px',
                  borderRadius: '8px',
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
                Post
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
}

export default PostModal;