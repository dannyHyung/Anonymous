import React from 'react';
import { Box, Typography, Button, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
        width: '100%',
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
              sx={{
                color: '#fff',
                marginRight: 2,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Hi, {currentUser.displayName || currentUser.email.split('@')[0]}
            </Typography>
            <IconButton onClick={handleMenu}>
              <Avatar
                src={currentUser.photoURL}
                alt={currentUser.displayName || currentUser.email.split('@')[0]}
                sx={{
                  bgcolor: currentUser.photoURL ? 'transparent' : '#0080ff',
                  '&:hover': { boxShadow: '0 0 8px #0080ff' }
                }}
              >
                {!currentUser.photoURL && (currentUser.displayName?.[0] || currentUser.email?.[0])}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={handleLogout}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.08)'
                  }
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box>
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
        )}
      </Box>
    </Box>
  );
}

export default AuthHeader;