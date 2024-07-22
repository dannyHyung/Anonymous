import React, { useState } from 'react';
import { Container, Button, Typography, Grid, Paper } from '@mui/material';
import PostModal from './PostModal';
import Post from './Post';
import { useAPI } from '../../contexts/APIContext';

function Dashboard() {
  const { posts } = useAPI();
  const [showModal, setShowModal] = useState(false);

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
      {showModal && <PostModal onClose={() => setShowModal(false)} />}
    </Container>
  );
}

export default Dashboard;
