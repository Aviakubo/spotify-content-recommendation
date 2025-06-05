// src/components/RecommendationsList.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Flex, Text, Button, Badge } from './ui';
import TrackCard from './TrackCard';
import { spotifyService } from '../services/api';
import { getClusterColor } from '../utils/colorUtils';

// Define types for our data
interface Track {
  id: string;
  name: string;
  artist: string;
  album_cover?: string;
  external_url?: string;
  cluster: number;
  danceability: number;
  energy: number;
  [key: string]: any; // For other audio features
}

interface RecommendationTrack {
  id: string;
  name: string;
  artists: Array<{name: string}>;
  album: {
    images: Array<{url: string}>
  };
  external_urls: {
    spotify: string;
  };
}

interface RecommendationsListProps {
  clusteredTracks: Track[];
  token: string;
}

// Styled Components with proper TypeScript props
const RecommendationsContainer = styled.div`
  width: 100%;
`;

const ClusterSelector = styled(Flex)`
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

interface ClusterButtonProps {
  active: boolean;
  color: string;
}

const ClusterButton = styled(motion.button)<ClusterButtonProps>`
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  background-color: ${props => props.active ? props.color : 'var(--color-background-alt)'};
  color: ${props => props.active ? 'white' : 'var(--color-text)'};
  border: 1px solid ${props => props.active ? props.color : 'var(--color-border)'};
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition);
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;

  &:hover {
    background-color: ${props => props.active ? props.color : 'var(--color-background-alt)'};
    transform: translateY(-2px);
  }
`;

const TracksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

interface FlexProps {
  justify?: string;
  align?: string;
  direction?: string;
  wrap?: string;
  gap?: string;
}

const LoadingContainer = styled(Flex)<FlexProps>`
  height: 200px;
`;

const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid var(--color-background-alt);
  border-top-color: var(--color-primary);
`;

interface TextProps {
  size?: string;
  weight?: string;
  color?: string;
  mb?: string;
}

const SectionHeading = styled(Text)<TextProps>`
  font-weight: 600;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
`;

// RecommendationsList Component
const RecommendationsList: React.FC<RecommendationsListProps> = ({ clusteredTracks, token }) => {
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationTrack[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Group tracks by cluster
  const tracksByCluster = clusteredTracks.reduce<Record<number, Track[]>>((acc, track) => {
    const cluster = track.cluster;
    if (!acc[cluster]) {
      acc[cluster] = [];
    }
    acc[cluster].push(track);
    return acc;
  }, {});
  
  // Get cluster numbers
  const clusterNumbers = Object.keys(tracksByCluster).map(Number).sort((a, b) => a - b);
  
  // Set initial selected cluster
  useEffect(() => {
    if (clusterNumbers.length > 0 && selectedCluster === null) {
      setSelectedCluster(clusterNumbers[0]);
    }
  }, [clusterNumbers, selectedCluster]);
  
// Fetch recommendations for the selected cluster
useEffect(() => {
  // Create a flag to prevent state updates after unmounting
  let isMounted = true;
  
  const fetchRecommendations = async () => {
    if (selectedCluster === null || !tracksByCluster[selectedCluster]) return;
    
    // Prevent concurrent requests
    if (loading) return;
    
    setLoading(true);
    try {
      console.log("Getting recommendations for cluster:", selectedCluster);
      
      // Get 5 random seed tracks from the selected cluster
      const clusterTracks = tracksByCluster[selectedCluster];
      
      // Create a stable seed selection (avoid re-shuffling)
      // Use the first 5 tracks or all if less than 5
      const seedTracks = clusterTracks.slice(0, 5).map(track => track.id);
      
      console.log("Using seed tracks:", seedTracks);
      
      // Use backend to get recommendations
      const response = await spotifyService.getRecommendations(seedTracks, token);
      
      // Only update state if component is still mounted
      if (isMounted) {
        if (response && response.recommendations) {
          console.log("Received recommendations:", response.recommendations.length);
          setRecommendations(response.recommendations);
        } else {
          console.warn("No recommendations returned:", response);
          setRecommendations([]);
        }
        
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      
      // Only update state if component is still mounted
      if (isMounted) {
        setRecommendations([]);
        setLoading(false);
      }
    }
  };
  
  // Only fetch if we have a selectedCluster and aren't already loading
  if (selectedCluster !== null && !loading) {
    fetchRecommendations();
  }
  
  // Cleanup function to prevent updates after unmounting
  return () => {
    isMounted = false;
  };
  
}, [selectedCluster, token]); // Remove tracksByCluster from dependencies
  
  // Handle cluster selection
  const handleClusterSelect = (cluster: number) => {
    setSelectedCluster(cluster);
  };
  
  return (
    <RecommendationsContainer>
      <Text style={{ fontSize: "small", marginBottom: "0.75rem"}} as="p">Select a cluster to see its tracks and get recommendations:</Text>
      
      <ClusterSelector as="div">
        {clusterNumbers.map(cluster => (
          <ClusterButton
            key={`cluster-${cluster}`}
            active={selectedCluster === cluster}
            color={getClusterColor(cluster)}
            onClick={() => handleClusterSelect(cluster)}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Cluster {cluster}
          </ClusterButton>
        ))}
      </ClusterSelector>
      
      {selectedCluster !== null && tracksByCluster[selectedCluster] && (
        <>
          <SectionHeading as="div">
            Cluster {selectedCluster} Tracks
            <Badge style={{ marginLeft: '0.5rem' }}>
              {tracksByCluster[selectedCluster].length} tracks
            </Badge>
          </SectionHeading>
          
          <TracksGrid>
            <AnimatePresence>
              {tracksByCluster[selectedCluster].slice(0, 6).map((track, index) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  index={index}
                  clusterColor={getClusterColor(selectedCluster)}
                />
              ))}
            </AnimatePresence>
          </TracksGrid>
          
          <SectionHeading as="div" style={{ marginTop: '2rem' }}>
            Recommendations Based on Cluster {selectedCluster}
          </SectionHeading>
          
          {loading ? (
            <LoadingContainer as="div" justify="center" align="center">
              <LoadingSpinner
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </LoadingContainer>
          ) : recommendations.length > 0 ? (
            <TracksGrid>
              <AnimatePresence>
                {recommendations.map((track, index) => (
                  <TrackCard
                    key={track.id}
                    track={{
                      id: track.id,
                      name: track.name,
                      artist: track.artists[0].name,
                      album_cover: track.album.images[0]?.url,
                      external_url: track.external_urls.spotify,
                      cluster: selectedCluster,
                      // Add some default values for audio features (these aren't actually used in recommendations view)
                      danceability: 0.5,
                      energy: 0.5
                    }}
                    index={index}
                    clusterColor={getClusterColor(selectedCluster)}
                    isRecommendation={true}
                  />
                ))}
              </AnimatePresence>
            </TracksGrid>
          ) : (
            <Text as="p">No recommendations available for this cluster.</Text>
          )}
        </>
      )}
    </RecommendationsContainer>
  );
};

export default RecommendationsList;