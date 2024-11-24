import React, { useState } from 'react';
import { Button, Typography, Box, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const AuthTest: React.FC = () => {
  const { user, login, logout, register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleTestRegister = async () => {
    try {
      setError(null);
      const testEmail = 'test@example.com';
      const testPassword = 'password123';
      await register('Test User', testEmail, testPassword);
      setSuccess(`User registered successfully: ${testEmail}`);
    } catch (error: any) {
      setError(error.message);
      console.error('Registration failed:', error);
    }
  };

  const handleTestLogin = async () => {
    try {
      setError(null);
      await login('test@example.com', 'password123');
      setSuccess('Login successful');
    } catch (error: any) {
      setError(error.message);
      console.error('Login failed:', error);
    }
  };

  const handleTestLogout = async () => {
    try {
      setError(null);
      await logout();
      setSuccess('Logout successful');
    } catch (error: any) {
      setError(error.message);
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Auth Test Component
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Typography gutterBottom>
        Current User: {user ? user.email : 'Not logged in'}
      </Typography>
      
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleTestRegister}
        >
          Register Test User
        </Button>
        
        <Button
          variant="contained"
          onClick={handleTestLogin}
        >
          Test Login
        </Button>
        
        <Button
          variant="outlined"
          onClick={handleTestLogout}
          disabled={!user}
        >
          Test Logout
        </Button>
      </Box>
    </Box>
  );
};

export default AuthTest;
