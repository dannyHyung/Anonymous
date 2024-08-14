import React, { useEffect, useState } from 'react';
import { Container, Button, Typography, Grid, Paper, Box, Fab, Tooltip } from '@mui/material';
import PostModal from './PostModal';
import Post from './Post';
import AddIcon from '@mui/icons-material/Add';
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
            <Container>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
                    <Typography variant="h3" style={{ color: '#ecf0f1' }}>Anonymous Community</Typography>
                    <Box sx={{ position: 'fixed', top: '3%', right: '3%' }}>
                        <Tooltip title="Post" arrow>
                            <Fab
                                color="primary"
                                aria-label="add"
                                onClick={() => setShowModal(true)}
                                sx={{ boxShadow: '0 4px 8px rgba(0,0,0,0.2), 0 6px 20px rgba(0,0,0,0.19)' }}
                            >
                                <AddIcon />
                            </Fab>
                        </Tooltip>
                    </Box>
                </header>
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

            {showModal && <PostModal onClose={() => setShowModal(false)} onPostCreated={handlePostCreated}/>}
        </Box>
    );
}

export default Dashboard;
