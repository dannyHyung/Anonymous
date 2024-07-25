import React, { useEffect, useState } from 'react';
import { Container, Button, Typography, Grid, Paper } from '@mui/material';
import PostModal from './PostModal';
import Post from './Post';
import { useAPI } from '../../contexts/APIContext';

function Dashboard() {
    const { fetchPosts, createPost } = useAPI();
    const [showModal, setShowModal] = useState(false);
    const [posts, setPosts] = useState([]);

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

    const handlePostCreated = async (content, image) => {
        await createPost(content, image);
        loadPosts(); // Refresh posts after creating a new post
        setShowModal(false); // Close the modal
      };

    return (
        <Container>
            <header className="flex justify-between items-center py-4">
                <Typography variant="h3">Anonymous Community</Typography>
                <Button variant="contained" color="primary" onClick={() => setShowModal(true)}>
                    Post Something
                </Button>
            </header>
            <Grid container spacing={3}>
                {posts.map((post) => (
                    <Grid item xs={12} key={post.id}>
                        <Paper elevation={3}>
                            <Post content={post.content} image={post.image} date={post.date} />
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            {showModal && <PostModal onClose={() => setShowModal(false)} onPostCreated={handlePostCreated}/>}
        </Container>
    );
}

export default Dashboard;
