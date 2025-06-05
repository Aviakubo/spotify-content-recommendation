// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Button, Card } from './ui';
import ClusterVisualization from './ClusterVisualization';
import RecommendationsList from './RecommendationsList';
import Visualization3D from './Visualization3D';
import ThemeToggle from './ThemeToggle';
import { spotifyService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

// Define interfaces for our data types
interface Track {
  id: string;
  name: string;
  artist: string;
  album_cover?: string;
  cluster: number;
  danceability: number;
  energy: number;
  [key: string]: any; // For other audio features
}

interface ClusterCenter {
  cluster_id: number;
  [key: string]: any; // For feature values
}

interface ClusterResults {
  clustered_tracks: Track[];
  cluster_centers: ClusterCenter[];
  visualization_data: any[];
  inertia: number;
  features_used: string[];
}

// Define interfaces for styled component props
interface TabProps {
  active: boolean;
}

// Styled Components
const DashboardContainer = styled.div`
  min-height: 100vh;
  background: var(--color-background);
  padding-bottom: 3rem;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

const LoadingSpinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid var(--color-background-alt);
  border-top-color: var(--color-primary);
`;

const ErrorContainer = styled(Card)`
  background-color: ${props => props.theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2'};
  border: 1px solid ${props => props.theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : '#fecaca'};
  color: var(--color-error);
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
`;

const Tab = styled.button<TabProps>`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.active ? 'var(--color-primary)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--color-text)'};
  border: none;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  margin-right: 0.5rem;

  &:hover {
    background-color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-background-alt)'};
  }
`;

const FlexCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SectionHeading = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text);
`;

// Dashboard Component
const Dashboard: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [clusterResults, setClusterResults] = useState<ClusterResults | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('2d'); // '2d' or '3d'
  const { token, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Fetch user tracks on component mount
  useEffect(() => {
    const fetchTracks = async () => {

      try {
        if (!token) return;
        
        const response = await spotifyService.fetchUserTracks(token);
        setTracks(response.tracks);
        
        // Perform initial clustering
        if (response.tracks.length > 0) {
          performClustering(response.tracks);
        }
      } catch (err) {
        console.error('Error fetching tracks:', err);
        setError('Failed to fetch your Spotify tracks. Please try logging in again.');
        setLoading(false);
      }
    };
    
    fetchTracks();
  }, [token]);
  
  // Perform clustering with the given parameters
  const performClustering = async (tracksData: Track[], params: any = {}) => {
    setLoading(true);
    try {
      const defaultParams = {
        n_clusters: 5,
        features: [
          'danceability', 'energy', 'speechiness', 
          'acousticness', 'instrumentalness', 
          'liveness', 'valence'
        ]
      };
      
      const clusterParams = { ...defaultParams, ...params };
      
      const response = await spotifyService.performClustering(
        tracksData,
        clusterParams.n_clusters,
        clusterParams.features
      );
      
      setClusterResults(response);
      setLoading(false);
    } catch (err) {
      console.error('Error clustering tracks:', err);
      setError('Failed to cluster your tracks. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle parameter changes from the visualization component
  const handleParameterChange = (params: any) => {
    performClustering(tracks, params);
  };

  return (
    <DashboardContainer>
      <Container>
        <StyledHeader>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold">Spotify Music Clusters</h1>
          </motion.div>
          
          <FlexCenter>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ThemeToggle isDark={theme === 'dark'} toggleTheme={toggleTheme} />
            </motion.div>
            
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button 
                onClick={logout}
                color="var(--color-error)"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </Button>
            </motion.div>
          </FlexCenter>
        </StyledHeader>
        
        {loading ? (
          <LoadingContainer>
            <LoadingSpinner
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </LoadingContainer>
        ) : error ? (
          <ErrorContainer theme={theme}>
            <p>{error}</p>
          </ErrorContainer>
        ) : (
          <AnimatePresence mode="wait">
            {clusterResults && (
              <>
                <TabsContainer>
                  <Tab 
                    active={activeTab === '2d'} 
                    onClick={() => setActiveTab('2d')}
                  >
                    2D Visualization
                  </Tab>
                  <Tab 
                    active={activeTab === '3d'} 
                    onClick={() => setActiveTab('3d')}
                  >
                    3D Visualization
                  </Tab>
                </TabsContainer>
                
                <AnimatePresence mode="wait">
                  {activeTab === '2d' ? (
                    <motion.div
                      key="2d-viz"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <GridLayout>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <Card>
                            <SectionHeading>Cluster Visualization</SectionHeading>
                            <ClusterVisualization 
                              data={clusterResults.visualization_data}
                              centers={clusterResults.cluster_centers}
                              features={clusterResults.features_used}
                              onParameterChange={handleParameterChange}
                            />
                          </Card>
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <Card>
                            <SectionHeading>Recommendations By Cluster</SectionHeading>
                            <RecommendationsList 
                              clusteredTracks={clusterResults.clustered_tracks}
                              token={token || ''}
                            />
                          </Card>
                        </motion.div>
                      </GridLayout>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="3d-viz"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card>
                        <SectionHeading>3D Cluster Visualization</SectionHeading>
                        <Visualization3D 
                          data={clusterResults.visualization_data}
                          centers={clusterResults.cluster_centers}
                          features={clusterResults.features_used}
                          onParameterChange={handleParameterChange}
                        />
                      </Card>
                      
                      <Card style={{ marginTop: '2rem' }}>
                        <SectionHeading>Recommendations By Cluster</SectionHeading>
                        <RecommendationsList 
                          clusteredTracks={clusterResults.clustered_tracks}
                          token={token || ''}
                        />
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </AnimatePresence>
        )}
      </Container>
    </DashboardContainer>
  );
};

export default Dashboard;