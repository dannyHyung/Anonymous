import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Button, TextField, Typography, Paper, 
  Container, Alert, CircularProgress, Divider,
  InputAdornment, IconButton
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, updateUserProfile, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== passwordConfirm) {
      return setError('Passwords do not match');
    }
    
    try {
      setError('');
      setLoading(true);
      const { user } = await signup(email, password);
      await updateUserProfile(user, { displayName });
      navigate('/');
    } catch (error) {
      setError('Failed to create an account: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await googleSignIn();
      navigate('/');
    } catch (error) {
      setError('Failed to sign in with Google: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
        padding: { xs: 2, sm: 4 }
      }}
    >
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper 
          elevation={10}
          sx={{ 
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: 'rgba(38, 38, 38, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Box 
            sx={{ 
              p: { xs: 3, sm: 4, md: 5 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center' 
            }}
          >
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ 
                mb: 3,
                fontWeight: 700,
                background: 'linear-gradient(45deg, #0080ff, #00b0ff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.5px'
              }}
            >
              Create Account
            </Typography>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  width: '100%',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(211, 47, 47, 0.1)',
                  color: '#ff5252',
                  '& .MuiAlert-icon': { color: '#ff5252' }
                }}
              >
                {error}
              </Alert>
            )}
            
            <Box 
              component="form" 
              onSubmit={handleSubmit}
              sx={{ width: '100%' }}
            >
              <TextField
                label="Full Name"
                type="text"
                fullWidth
                margin="normal"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                variant="outlined"
                InputLabelProps={{ style: { color: '#aaa' } }}
                InputProps={{ 
                  style: { color: '#fff' },
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#888' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                    '&.Mui-focused fieldset': { borderColor: '#0080ff' }
                  }
                }}
              />
              
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="outlined"
                InputLabelProps={{ style: { color: '#aaa' } }}
                InputProps={{ 
                  style: { color: '#fff' },
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#888' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                    '&.Mui-focused fieldset': { borderColor: '#0080ff' }
                  }
                }}
              />
              
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                InputLabelProps={{ style: { color: '#aaa' } }}
                InputProps={{ 
                  style: { color: '#fff' },
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#888' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#888' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                    '&.Mui-focused fieldset': { borderColor: '#0080ff' }
                  }
                }}
              />
              
              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                variant="outlined"
                InputLabelProps={{ style: { color: '#aaa' } }}
                InputProps={{ 
                  style: { color: '#fff' },
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#888' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        sx={{ color: '#888' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                    '&.Mui-focused fieldset': { borderColor: '#0080ff' }
                  }
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  background: 'linear-gradient(90deg, #0080ff, #00b0ff)',
                  py: 1.5,
                  color: 'white',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 20px rgba(0, 128, 255, 0.5)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #0070e0, #009fef)',
                    boxShadow: '0 6px 25px rgba(0, 128, 255, 0.7)',
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
              </Button>
              
              <Divider 
                sx={{ 
                  my: 3, 
                  color: '#aaa', 
                  fontSize: '0.875rem',
                  '&::before, &::after': { 
                    borderColor: 'rgba(255, 255, 255, 0.1)' 
                  } 
                }}
              >
                or continue with
              </Divider>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleSignIn}
                disabled={loading}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: 'rgba(255,255,255,0.05)'
                  }
                }}
              >
                Google
              </Button>
              
              <Box mt={3} textAlign="center">
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  Already have an account?{' '}
                  <Button 
                    onClick={() => navigate('/login')} 
                    sx={{ 
                      color: '#0080ff', 
                      textTransform: 'none', 
                      fontWeight: 600,
                      p: 0,
                      '&:hover': {
                        backgroundColor: 'transparent',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Log In
                  </Button>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Signup;