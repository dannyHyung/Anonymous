import React, { useEffect, useState } from 'react';
import { Container, Button, Typography, Grid, Box, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
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
            const response = await fetchPosts();
            setPosts(response.data);
        } catch (err) {
            console.error('Failed to fetch posts', err);
        }
    };

    const handlePostCreated = async (content, images, mediaType) => {
        if (!currentUser) {
            showAuthAlert();
            return;
        }

        await createPost(content, images, mediaType);
        loadPosts();
        setShowModal(false);
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

            <Container sx={{ mt: '2%' }}>
                <Grid container spacing={3}>
                    {posts.map((post) => (
                        <Grid item xs={12} key={post.post_id}>
                            <Post
                                id={post.post_id}
                                content={post.content}
                                image={post.image}
                                images={post.images || []} // Add this line
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

            <Box
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '60px',
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
                    <IconButton onClick={handleAddPostClick}>
                        <AddBoxIcon sx={{ color: 'white', fontSize: '50px' }} />
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