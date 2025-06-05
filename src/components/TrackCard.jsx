// src/components/TrackCard.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Text, ProgressBar } from './ui';

// Styled Components
const Card = styled(motion.div)`
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const AlbumCover = styled.div`
  width: 100%;
  position: relative;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  overflow: hidden;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 0.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ClusterIndicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.color || 'var(--color-primary)'};
  margin-right: 0.5rem;
`;

const FeatureBar = styled.div`
  margin-top: 0.5rem;
`;

const PlayButton = styled(motion.a)`
  margin-top: auto;
  padding: 0.5rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

// TrackCard Component
const TrackCard = ({ track, index, clusterColor, isRecommendation = false }) => {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5, boxShadow: 'var(--shadow-md)' }}
    >
      <AlbumCover>
        {track.album_cover ? (
          <Image src={track.album_cover} alt={track.name} />
        ) : (
          <div 
            style={{ 
              backgroundColor: clusterColor, 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 16.5C9.51 16.5 7.5 14.49 7.5 12C7.5 9.51 9.51 7.5 12 7.5C14.49 7.5 16.5 9.51 16.5 12C16.5 14.49 14.49 16.5 12 16.5Z" />
            </svg>
          </div>
        )}
      </AlbumCover>
      
      <CardContent>
        <Text size="sm" weight="bold" mb="0.25rem" style={{ 
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {track.name}
        </Text>
        
        <Text size="xs" mb="0.5rem" style={{ 
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'var(--color-text-light)'
        }}>
          {track.artist}
        </Text>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
          <ClusterIndicator color={clusterColor} />
          <Text size="xs" style={{ color: 'var(--color-text-light)' }}>
            Cluster {track.cluster}
          </Text>
        </div>
        
        {!isRecommendation && (
          <>
            <FeatureBar>
              <Text size="xs" mb="0.25rem" style={{ color: 'var(--color-text-light)' }}>
                Danceability
              </Text>
              <ProgressBar value={track.danceability * 100} color={clusterColor} />
            </FeatureBar>
            
            <FeatureBar>
              <Text size="xs" mb="0.25rem" style={{ color: 'var(--color-text-light)' }}>
                Energy
              </Text>
              <ProgressBar value={track.energy * 100} color={clusterColor} />
            </FeatureBar>
          </>
        )}
        
        <PlayButton 
          href={track.external_url || `https://open.spotify.com/track/${track.id}`} 
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Play on Spotify
        </PlayButton>
      </CardContent>
    </Card>
  );
};

export default TrackCard;