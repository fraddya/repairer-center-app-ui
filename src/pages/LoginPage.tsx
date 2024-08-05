import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Implement your login logic here
    if (username === 'admin' && password === 'admin') {
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(45deg, #e68600, #d6982d, #d1ad1d, #f5bc02)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
        '@keyframes gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: '15%',
          bottom: '20%',
          height: '60%',
          width: '20%',
          background: 'url(./images/mechanic_man.png) no-repeat left bottom',
          backgroundSize: 'contain',
          animation: 'moveUpDown 2s infinite alternate',
          '@keyframes moveUpDown': {
            '0%': { transform: 'translateY(0)' },
            '100%': { transform: 'translateY(-20px)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          right: '15%',
          top: '05%',
          height: '40%',
          width: '40%',
          background: 'url(./images/gear.png) no-repeat center center',
          backgroundSize: 'contain',
          animation: 'rotateGear 5s linear infinite',
          '@keyframes rotateGear': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          right: '16%',
          bottom: '10%',
          height: '20%',
          width: '20%',
          background: 'url(./images/gear2.png) no-repeat center center',
          backgroundSize: 'contain',
          animation: 'rotateGear 5s linear infinite',
          '@keyframes rotateGear': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: '35%',
          bottom: '06%',
          height: '25%',
          width: '25%',
          background: 'url(./images/spanner.png) no-repeat center center',
          backgroundSize: 'contain',
          animation: 'moveLeftRight 3s infinite alternate',
          '@keyframes moveLeftRight': {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-20px)' },
          },
        }}
      />
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={3}
          sx={{
            padding: '30px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <Typography variant="h3" gutterBottom align="center" sx={{ marginBottom: '10px', color: '#FF5722', fontWeight: 'bold' }}>
            Login
          </Typography>
          <Box display="flex" justifyContent="center" mb={3}>
            <img src='./images/Main_logo.png' alt="Company Logo" style={{ height: '150px' }} />
          </Box>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              label="Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ marginBottom: '20px', input: { color: '#FFF' } }}
              variant="outlined"
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ marginBottom: '20px', input: { color: '#FFF' } }}
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
              sx={{ padding: '10px 0', backgroundColor: '#FF5722' }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
