import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

function Post({ content, image, date }) {
  return (
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
            style={{ marginTop: '16px', borderRadius: '8px' }}
          />
        )}
        <Box mt={2}>
          <Typography variant="body2" color="textSecondary">
            Posted on: {new Date(date).toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Post;
