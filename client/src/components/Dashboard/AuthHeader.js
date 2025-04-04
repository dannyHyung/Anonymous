import React from 'react';
import { Box, Typography, Button, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';

function AuthHeader() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <Box
      sx={{
        borderBottom: '1px solid #333',
        padding: '14px 0',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        backgroundColor: '#1d1d1d',
        zIndex: 1100,
        paddingX: '20px'
      }}
    >
      {/* Left empty space */}
      <Box></Box>

      {/* Centered title */}
      <Typography
        variant="h4"
        sx={{
          fontFamily: "'Dancing Script', cursive",
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
        Anonymous
      </Typography>

      {/* Right content - authentication controls */}
      <Box sx={{ justifySelf: 'flex-end' }}>
        {currentUser ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              onClick={handleMenu}
              sx={{
                color: '#fff',
                padding: { xs: '6px 10px', sm: '8px 16px' }, // Smaller padding on mobile
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: { xs: '0.85rem', sm: '0.95rem' }, // Smaller font on mobile
                fontFamily: "'Inter', 'Roboto', sans-serif",
                letterSpacing: '0.4px',
                position: 'relative',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(90deg, rgba(0,128,255,0.1), rgba(0,176,255,0.1))',
                border: '1px solid rgba(255,255,255,0.1)',
                maxWidth: { xs: '150px', sm: 'none' }, // Limit width on mobile
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-2px',
                  left: '-2px',
                  right: '-2px',
                  bottom: '-2px',
                  background: 'linear-gradient(90deg, #0080ff, #00b0ff)',
                  borderRadius: '22px',
                  zIndex: -1,
                  opacity: 0.4,
                  filter: 'blur(8px)',
                  transition: 'opacity 0.3s ease, filter 0.3s ease',
                },
                '&:hover': {
                  background: 'linear-gradient(90deg, rgba(0,128,255,0.2), rgba(0,176,255,0.2))',
                  '&::before': {
                    opacity: 0.7,
                    filter: 'blur(12px)',
                  }
                }
              }}
            >
              Hi, {currentUser.displayName
                ? currentUser.displayName.split(' ')[0] // Just show first name
                : currentUser.email.split('@')[0]}
            </Typography>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  backgroundColor: '#262626',
                  color: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  minWidth: '100px',
                  transform: 'translateY(8px)'
                }
              }}
              TransitionProps={{
                style: {
                  transition: 'all 0.2s ease'
                }
              }}
            >
              <MenuItem
                onClick={handleLogout}
                sx={{
                  borderRadius: '6px',
                  fontWeight: 500,
                  fontSize: { xs: '0.85rem', sm: '0.95rem' }, // Smaller font on mobile
                  padding: { xs: '6px 10px', sm: '8px 12px' }, // Smaller padding on mobile
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: '6px', sm: '8px' }, // Smaller gap on mobile
                  height: { xs: '32px', sm: '36px' }, // Explicit height
                  minHeight: 'unset', // Override Material UI's default min-height
                  '&:hover': {
                    backgroundColor: 'rgba(0, 128, 255, 0.1)',
                    color: '#0080ff',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                <LogoutIcon fontSize="small" />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <>
            {/* Desktop view - show both buttons */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  marginRight: 1.5,
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontWeight: 500,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#0080ff',
                    backgroundColor: 'rgba(0,128,255,0.08)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,128,255,0.15)'
                  }
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/signup')}
                sx={{
                  background: 'linear-gradient(45deg, #0080ff, #00b0ff)',
                  borderRadius: '8px',
                  padding: '8px 20px',
                  color: '#fff',
                  fontWeight: 500,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  boxShadow: '0 2px 10px rgba(0,128,255,0.4)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0070e0, #009fef)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 15px rgba(0,128,255,0.5)'
                  }
                }}
              >
                Sign Up
              </Button>
            </Box>

            {/* Mobile view - show only one button */}
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{
                  background: 'linear-gradient(45deg, #0080ff, #00b0ff)',
                  borderRadius: '8px',
                  padding: '8px 20px',
                  color: '#fff',
                  fontWeight: 500,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  boxShadow: '0 2px 10px rgba(0,128,255,0.4)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0070e0, #009fef)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 15px rgba(0,128,255,0.5)'
                  }
                }}
              >
                Login
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default AuthHeader;