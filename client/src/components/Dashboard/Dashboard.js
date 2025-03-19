import React, { useEffect, useState } from 'react';
import { Container, Button, Typography, Grid, Box, IconButton, Tooltip, AppBar, Toolbar } from '@mui/material';
import PostModal from './PostModal';
import Post from './Post';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useAPI } from '../../contexts/APIContext';

function Dashboard() {
    const { fetchPosts, createPost, refresh, setRefresh, deletePost, likePost } = useAPI();
    const [showModal, setShowModal] = useState(false);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (refresh) {
            loadPosts();
        }
    }, [refresh]);

    const loadPosts = async () => {
        try {
            const response = await fetchPosts();
            setPosts(response.data);
            // setRefresh(false);
        } catch (err) {
            console.error('Failed to fetch posts', err);
        }
    };

    const handlePostCreated = async (content, image) => {
        await createPost(content, image);
        loadPosts();
        setShowModal(false);
    };

    const handleLikePost = async (postId) => {
        const response = await likePost(postId);
        setPosts(posts.map(post => post.post_id === postId ? response.data : post));
    };

    const handleDeletePost = async (postId) => {
        await deletePost(postId);
        setPosts(posts.filter(post => post.post_id !== postId));
    };

    return (
        <Box sx={{ backgroundColor: '#1d1d1d', minHeight: '100vh', paddingBottom: '50px' }}>
            <Box
                sx={{
                    borderBottom: '1px solid #333',
                    padding: '14px 0',
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'sticky',
                    top: 0,
                    backgroundColor: '#1d1d1d',
                    zIndex: 1100,
                    width: '100%',
                }}
            >
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
            </Box>
            <Container sx={{ mt: '2%' }}>
                <Grid container spacing={3}>
                    {posts.map((post) => (
                        <Grid item xs={12} key={post.post_id}>
                            <Post
                                id={post.post_id}
                                content={post.content}
                                image={post.image}
                                date={post.date}
                                likes={post.likes}
                                comments={post.comments}
                                onLike={handleLikePost}
                                onDelete={handleDeletePost}
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
                    <IconButton
                        onClick={() => setShowModal(true)}
                    >
                        <AddBoxIcon sx={{ color: 'white', fontSize: '50px' }} />
                    </IconButton>
                </Tooltip>
            </Box>

            {showModal && <PostModal onClose={() => setShowModal(false)} onPostCreated={handlePostCreated} />}
        </Box>
    );
}

export default Dashboard;
