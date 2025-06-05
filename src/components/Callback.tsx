// src/components/Callback.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { spotifyService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// Define interfaces for styled component props
interface TitleProps {
  error?: boolean;
}

// Styled Components
const CallbackContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
`;

const CallbackCard = styled(motion.div)`
  background-color: var(--color-background);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  max-width: 450px;
  width: 90%;
  text-align: center;
`;

const Title = styled.h2<TitleProps>`
  font-size: 1.5rem;
  color: ${props => props.error ? 'var(--color-error)' : 'var(--color-text)'};
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: var(--color-text-light);
  margin-bottom: 1.5rem;
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: var(--transition);

  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const Loader = styled(motion.div)`
  width: 4rem;
  height: 4rem;
  border: 4px solid rgba(99, 102, 241, 0.2);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  margin: 0 auto 1.5rem;
`;

// Component
const Callback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const { setToken } = useAuth();

  useEffect(() => {
    const getToken = async () => {
      try {
        // Get the authorization code from URL parameters
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          throw new Error('No authorization code found in the callback URL');
        }
        
        // Exchange code for token
        const response = await spotifyService.exchangeToken(code);
        
        if (response && response.access_token) {
          // Set the token in context
          setToken(response.access_token);
          
          // Redirect to dashboard
          navigate('/dashboard');
        } else {
          throw new Error('No access token received from the server');
        }
      } catch (err) {
        console.error('Error during token exchange:', err);
        setError('Failed to complete authentication. Please try again.');
      }
    };
    
    getToken();
  }, [location, navigate, setToken]);

  return (
    <CallbackContainer>
      <CallbackCard
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {error ? (
          <>
            <Title error={true}>Authentication Error</Title>
            <Message>{error}</Message>
            <Button 
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Return to Login
            </Button>
          </>
        ) : (
          <>
            <Title>Connecting to Spotify</Title>
            <Loader
              animate={{ 
                rotate: 360,
              }} 
              transition={{ 
                duration: 1, 
                repeat: Infinity,
                ease: "linear" 
              }}
            />
            <Message>
              Authenticating with Spotify, please wait...
            </Message>
          </>
        )}
      </CallbackCard>
    </CallbackContainer>
  );
};

export default Callback;