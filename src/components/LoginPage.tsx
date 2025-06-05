// src/components/LoginPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { spotifyService } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

// Define interfaces for styled component props
interface GradientCircleProps {
  size?: string;
  top?: string;
  left?: string;
  color?: string;
  delay?: string;
}

interface NoteProps {
  size?: string;
  top?: string;
  left?: string;
  delay?: string;
}

// Styled Components
const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  position: relative;
  overflow: hidden;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const GradientCircle = styled.div<GradientCircleProps>`
  position: absolute;
  width: ${props => props.size || '300px'};
  height: ${props => props.size || '300px'};
  border-radius: 50%;
  background: ${props => props.color || 'rgba(255, 255, 255, 0.1)'};
  filter: blur(40px);
  opacity: 0.4;
  animation: pulse 4s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  top: ${props => props.top || '50%'};
  left: ${props => props.left || '50%'};
  transform: translate(-50%, -50%);
`;

const Note = styled.div<NoteProps>`
  position: absolute;
  color: rgba(255, 255, 255, 0.6);
  font-size: ${props => props.size || '24px'};
  top: ${props => props.top || '0'};
  left: ${props => props.left || '0'};
  animation: float 6s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  pointer-events: none;
`;

const LoginCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2.5rem;
  max-width: 450px;
  width: 90%;
  z-index: 1;
  box-shadow: var(--shadow-lg);
`;

const Logo = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  color: white;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
`;

const ErrorMessage = styled(motion.div)`
  background-color: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.5);
  color: white;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
`;

const LoginButton = styled(motion.button)`
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: var(--transition);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Features = styled.div`
  margin-top: 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;

  p {
    margin-bottom: 0.5rem;
  }
`;

const SpinnerIcon = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
`;

// Component
const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get authorization URL from the backend
      const response = await spotifyService.getLoginUrl();
      
      if (response && response.auth_url) {
        // Redirect to Spotify authorization page
        window.location.href = response.auth_url;
      } else {
        throw new Error('Failed to get authorization URL');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to connect to Spotify. Please try again.');
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <LoginContainer>
      {/* Background Elements */}
      <Background>
        <GradientCircle size="500px" top="30%" left="20%" color="rgba(99, 102, 241, 0.4)" delay="0s" />
        <GradientCircle size="400px" top="70%" left="80%" color="rgba(16, 185, 129, 0.4)" delay="1s" />
        
        <Note size="28px" top="10%" left="10%" delay="0s">♪</Note>
        <Note size="36px" top="25%" left="25%" delay="2s">♫</Note>
        <Note size="28px" top="40%" left="70%" delay="1s">♬</Note>
        <Note size="32px" top="65%" left="85%" delay="3s">♪</Note>
        <Note size="24px" top="80%" left="15%" delay="2.5s">♫</Note>
      </Background>
      
      {/* Login Card */}
      <LoginCard
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Logo>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.5 16.5C16.23 16.5 15.96 16.38 15.75 16.17C14.72 15.14 13.23 14.57 11.64 14.57C10.3 14.57 9.01 14.9 7.89 15.54C7.4 15.82 6.76 15.65 6.48 15.15C6.21 14.65 6.38 14.01 6.88 13.73C8.31 12.89 9.95 12.5 11.64 12.5C13.78 12.5 15.77 13.27 17.25 14.75C17.66 15.16 17.66 15.84 17.25 16.25C17.04 16.41 16.77 16.5 16.5 16.5ZM17.5 13.5C17.13 13.5 16.77 13.33 16.5 13.06C15.21 11.77 13.22 11 11.17 11C9.48 11 7.89 11.4 6.51 12.17C5.99 12.47 5.33 12.24 5.04 11.71C4.74 11.18 4.97 10.52 5.5 10.23C7.22 9.27 9.14 8.8 11.17 8.8C13.72 8.8 16.17 9.73 18.04 11.58C18.4 11.94 18.45 12.49 18.18 12.91C17.92 13.32 17.22 13.61 17.5 13.5Z" fill="white"/>
            </svg>
          </Logo>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Title>Music Cluster</Title>
          <Subtitle>Discover new music through advanced clustering</Subtitle>
        </motion.div>
        
        {error && (
          <motion.div variants={itemVariants}>
            <ErrorMessage>{error}</ErrorMessage>
          </motion.div>
        )}
        
        <motion.div variants={itemVariants}>
          <LoginButton
            onClick={handleLogin}
            disabled={isLoading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <SpinnerIcon />
            ) : (
              <>
                Connect with Spotify
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20" style={{ marginLeft: '8px' }}>
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </LoginButton>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Features>
            <p>Discover your music taste patterns</p>
            <p>Find new tracks based on your listening history</p>
            <p>Visualize your music preferences in 3D space</p>
          </Features>
        </motion.div>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;