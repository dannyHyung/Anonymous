import React, { useEffect, useState } from 'react';
import { Container, Button, Typography, Grid, Box, IconButton, Tooltip, Snackbar, Alert, CircularProgress } from '@mui/material';
import PostModal from './PostModal';
import Post from './Post';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useAPI } from '../../contexts/APIContext';
import { useAuth } from '../../contexts/AuthContext';
import AuthHeader from './AuthHeader';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const { fetchPosts, createPost, deletePost, likePost } = useAPI();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [posts, setPosts] = useState([]);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setIsLoading(true);
            const response = await fetchPosts();
            setPosts(response.data);
        } catch (err) {
            console.error('Failed to fetch posts', err);
            setAlert({
                open: true,
                message: 'Failed to load posts. Please refresh.',
                severity: 'error'
            });
        }
        finally {
            setIsLoading(false)
        }
    };

    const handlePostCreated = async (content, images, mediaType) => {
        if (!currentUser) {
            showAuthAlert();
            return false;
        }

        try {
            await createPost(content, images, mediaType);
            await loadPosts(); // Use await to make sure posts are loaded
            setShowModal(false); // Only close the modal after successful post creation
            return true; // Return success
        } catch (error) {
            console.error('Failed to create post:', error);
            setAlert({
                open: true,
                message: 'Failed to create post. Please try again.',
                severity: 'error'
            });
            return false; // Return failure
        }
    };

    const handleLikePost = async (postId) => {
        try {
            const response = await likePost(postId);
            setPosts(posts.map(post => post.post_id === postId ? response.data : post));
            return response.data;
        } catch (error) {
            console.error('Failed to like post', error);
            return null;
        }
    };

    const handleDeletePost = async (postId) => {
        if (!currentUser) {
            showAuthAlert();
            return;
        }

        try {
            await deletePost(postId);
            setPosts(posts.filter(post => post.post_id !== postId));
        } catch (error) {
            console.error('Failed to delete post', error);
        }
    };

    const showAuthAlert = () => {
        setAlert({
            open: true,
            message: 'You need to log in or sign up to do that',
            severity: 'warning'
        });
    };

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };

    const handleAddPostClick = () => {
        if (!currentUser) {
            showAuthAlert();
        } else {
            setShowModal(true);
        }
    };

    return (
        <Box sx={{ backgroundColor: '#1d1d1d', minHeight: '100vh', paddingBottom: '50px' }}>
            <AuthHeader />

            {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    loading...
                </Box>
            ) : (
                <Container
                    sx={{
                        mt: { xs: "4%", sm: "3%", md: "2%" },
                        px: { xs: 2, sm: 2, md: 3 } // Reduce padding on small screens
                    }}
                >
                    <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}> {/* Adjust spacing based on screen size */}
                        {posts.map((post) => (
                            <Grid item xs={12} key={post.post_id}>
                                <Post
                                    id={post.post_id}
                                    content={post.content}
                                    image={post.image}
                                    images={post.images || []}
                                    mediaType={post.mediaType || 'image'}
                                    date={post.date}
                                    likes={post.likes}
                                    comments={post.comments}
                                    onLike={handleLikePost}
                                    onDelete={handleDeletePost}
                                    isAuthenticated={!!currentUser}
                                    onAuthNeeded={showAuthAlert}
                                    currentUserId={currentUser ? currentUser.uid : null}
                                    postUserId={post.userId}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            )}

            <Box
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: { xs: '50px', sm: '60px' }, // Smaller height on mobile
                    backgroundColor: '#1d1d1d',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderTop: '1px solid #333',
                    zIndex: 1000,
                    boxShadow: '0 -2px 10px rgba(0,0,0,0.2)'
                }}
            >
                <Tooltip title="Create Post" arrow>
                    <IconButton onClick={handleAddPostClick} disabled={isLoading}>
                        <AddBoxIcon sx={{
                            color: 'white',
                            fontSize: { xs: '40px', sm: '50px' } // Smaller icon on mobile
                        }} />
                    </IconButton>
                </Tooltip>
            </Box>
            {showModal && <PostModal onClose={() => setShowModal(false)} onPostCreated={handlePostCreated} />}

            <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseAlert}
                    severity={alert.severity}
                    elevation={6}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Dashboard;