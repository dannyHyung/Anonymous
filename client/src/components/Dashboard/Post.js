import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

function Post({ content, image, date }) {
  return (
    <Box sx={{ maxWidth: { xs: 300, sm: 400, md: 600 }, margin: '0 auto', mb: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="body1" color="textPrimary" component="p">
            {content}
          </Typography>
          {image && (
            <CardMedia
              component="img"
              image={image}
              alt="Post"
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />
          )}
          <Box mt={2}>
            <Typography variant="body2" color="textSecondary">
              Posted on: {new Date(date).toLocaleString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Post;
