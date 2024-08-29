import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/system';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

const HeroSection = styled('div')(({ theme }) => ({
  backgroundImage: 'url(https://images.unsplash.com/photo-1643271006428-dc0d47303d49?ixid=M3w2MzIxNTd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjQ5NzIyMDR8&ixlib=rb-4.0.3)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(8),
  textAlign: 'center',
  marginBottom: theme.spacing(4),
}));

const PostCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  boxShadow: theme.shadows[1],
}));

interface Post {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const onSubmit = async (data: { title: string; body: string; author: string }) => {
    setLoading(true);
    try {
      await backend.addPost(data.title, data.body, data.author);
      reset();
      setShowForm(false);
      await fetchPosts();
    } catch (error) {
      console.error('Error adding post:', error);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md">
      <HeroSection>
        <Typography variant="h2" component="h1" gutterBottom>
          Crypto Blog
        </Typography>
        <Typography variant="h5">
          Explore the latest in cryptocurrency and blockchain technology
        </Typography>
      </HeroSection>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowForm(!showForm)}
        style={{ marginBottom: '1rem' }}
      >
        {showForm ? 'Cancel' : 'New Post'}
      </Button>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="title"
            control={control}
            defaultValue=""
            rules={{ required: 'Title is required' }}
            render={({ field, fieldState: { error } }) => (
              <Box mb={2}>
                <Typography variant="subtitle1">Title</Typography>
                <input {...field} style={{ width: '100%', padding: '0.5rem' }} />
                {error && <Typography color="error">{error.message}</Typography>}
              </Box>
            )}
          />
          <Controller
            name="body"
            control={control}
            defaultValue=""
            rules={{ required: 'Body is required' }}
            render={({ field, fieldState: { error } }) => (
              <Box mb={2}>
                <Typography variant="subtitle1">Body</Typography>
                <textarea {...field} rows={4} style={{ width: '100%', padding: '0.5rem' }} />
                {error && <Typography color="error">{error.message}</Typography>}
              </Box>
            )}
          />
          <Controller
            name="author"
            control={control}
            defaultValue=""
            rules={{ required: 'Author is required' }}
            render={({ field, fieldState: { error } }) => (
              <Box mb={2}>
                <Typography variant="subtitle1">Author</Typography>
                <input {...field} style={{ width: '100%', padding: '0.5rem' }} />
                {error && <Typography color="error">{error.message}</Typography>}
              </Box>
            )}
          />
          <Button type="submit" variant="contained" color="primary">
            Submit Post
          </Button>
        </form>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        posts.map((post) => (
          <PostCard key={Number(post.id)}>
            <Typography variant="h5" component="h2" gutterBottom>
              {post.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {post.body}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              By {post.author} | {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
            </Typography>
          </PostCard>
        ))
      )}
    </Container>
  );
}

export default App;
