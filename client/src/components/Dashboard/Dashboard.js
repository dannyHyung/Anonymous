import React, { useEffect, useState } from 'react';
import { Container, Button, Typography, Grid, Paper, Box } from '@mui/material';
import PostModal from './PostModal';
import Post from './Post';
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
        <Box sx={{ backgroundColor: '#1d1d1d', minHeight: '100vh', padding: '20px 0' }}>
            <Container>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
                    <Typography variant="h3" style={{ color: '#ecf0f1' }}>Anonymous Community</Typography>
                    <Button variant="contained" color="primary" onClick={() => setShowModal(true)}>
                        Post
                    </Button>
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
                {showModal && <PostModal onClose={() => setShowModal(false)} onPostCreated={handlePostCreated} />}
            </Container>
        </Box>
    );
}

export default Dashboard;
