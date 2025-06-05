// src/components/Visualization3D.jsx
import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { Select, Button } from './ui';
import { formatFeatureName } from '../utils/formatters';
import { getClusterColor } from '../utils/colorUtils';

// Styled Components
const VisualizationContainer = styled.div`
  width: 100%;
  height: 600px;
  position: relative;
`;

const ControlsContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1rem;
  z-index: 10;
  width: 250px;
  box-shadow: var(--shadow-md);
`;

const ControlItem = styled.div`
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.375rem;
  color: var(--color-text);
`;

const RangeInput = styled.input`
  width: 100%;
  appearance: none;
  height: 6px;
  border-radius: 9999px;
  background: var(--color-background-alt);
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--color-primary);
    cursor: pointer;
    transition: var(--transition);
  }
  
  &::-webkit-slider-thumb:hover {
    box-shadow: 0 0 0 6px rgba(79, 70, 229, 0.2);
  }
`;

const InstructionsOverlay = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  z-index: 10;
  pointer-events: none;
`;

// Track point component
const TrackPoint = ({ position, color, track, onHover, onLeave }) => {
  const mesh = useRef();
  
  // Subtle hover animation
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
    }
  });
  
  return (
    <mesh
      ref={mesh}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(track);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        onLeave();
        document.body.style.cursor = 'default';
      }}
    >
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
    </mesh>
  );
};

// Cluster center component
const ClusterCenter = ({ position, color, size = 0.5 }) => {
  const mesh = useRef();
  
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
    }
  });
  
  return (
    <mesh ref={mesh} position={position}>
      <octahedronGeometry args={[size, 0]} />
      <meshStandardMaterial 
        color={color} 
        metalness={0.8} 
        roughness={0.1} 
        emissive={color} 
        emissiveIntensity={0.5} 
      />
    </mesh>
  );
};

// Tooltip component
const TrackTooltip = ({ track }) => {
  return (
    <Html>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '0.5rem',
        borderRadius: '4px',
        fontSize: '12px',
        maxWidth: '150px',
        pointerEvents: 'none',
        transform: 'translateX(10px)'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{track.name}</div>
        <div style={{ fontSize: '10px', marginBottom: '4px' }}>by {track.artist}</div>
        <div style={{ fontSize: '10px' }}>Cluster: {track.cluster}</div>
      </div>
    </Html>
  );
};

// Main 3D Visualization Component
const Visualization3D = ({ data, centers, features, onParameterChange }) => {
  const [hoveredTrack, setHoveredTrack] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState({
    x: features[0],
    y: features[1],
    z: features[2] || features[0]
  });
  const [numClusters, setNumClusters] = useState(5);
  
  // Update selected features when available features change
  useEffect(() => {
    setSelectedFeatures({
      x: features[0],
      y: features[1],
      z: features[2] || features[0]
    });
  }, [features]);
  
  // Handle feature change
  const handleFeatureChange = (axis, feature) => {
    setSelectedFeatures(prev => ({
      ...prev,
      [axis]: feature
    }));
  };
  
  // Handle parameter change
  const handleParameterChange = () => {
    onParameterChange({
      n_clusters: numClusters,
      features: features
    });
  };
  
  return (
    <VisualizationContainer>
      {/* Controls */}
      <ControlsContainer>
        <ControlItem>
          <Label>X-Axis Feature</Label>
          <Select
            value={selectedFeatures.x}
            onChange={(e) => handleFeatureChange('x', e.target.value)}
          >
            {features.map(feature => (
              <option key={`x-${feature}`} value={feature}>{formatFeatureName(feature)}</option>
            ))}
          </Select>
        </ControlItem>
        
        <ControlItem>
          <Label>Y-Axis Feature</Label>
          <Select
            value={selectedFeatures.y}
            onChange={(e) => handleFeatureChange('y', e.target.value)}
          >
            {features.map(feature => (
              <option key={`y-${feature}`} value={feature}>{formatFeatureName(feature)}</option>
            ))}
          </Select>
        </ControlItem>
        
        <ControlItem>
          <Label>Z-Axis Feature</Label>
          <Select
            value={selectedFeatures.z}
            onChange={(e) => handleFeatureChange('z', e.target.value)}
          >
            {features.map(feature => (
              <option key={`z-${feature}`} value={feature}>{formatFeatureName(feature)}</option>
            ))}
          </Select>
        </ControlItem>
        
        <ControlItem>
          <Label>Number of Clusters: {numClusters}</Label>
          <RangeInput 
            type="range" 
            min="2" 
            max="10" 
            value={numClusters}
            onChange={(e) => setNumClusters(parseInt(e.target.value))}
          />
        </ControlItem>
        
        <Button
          onClick={handleParameterChange}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ width: '100%' }}
        >
          Update Clustering
        </Button>
      </ControlsContainer>
      
      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Coordinate system axes */}
        <group>
          {/* X axis (red) */}
          <mesh position={[5, 0, 0]}>
            <boxGeometry args={[10, 0.05, 0.05]} />
            <meshStandardMaterial color="red" />
          </mesh>
          <Text position={[10.5, 0, 0]} fontSize={0.5} color="red">
            {formatFeatureName(selectedFeatures.x)}
          </Text>
          
          {/* Y axis (green) */}
          <mesh position={[0, 5, 0]}>
            <boxGeometry args={[0.05, 10, 0.05]} />
            <meshStandardMaterial color="green" />
          </mesh>
          <Text position={[0, 10.5, 0]} fontSize={0.5} color="green">
            {formatFeatureName(selectedFeatures.y)}
          </Text>
          
          {/* Z axis (blue) */}
          <mesh position={[0, 0, 5]}>
            <boxGeometry args={[0.05, 0.05, 10]} />
            <meshStandardMaterial color="blue" />
          </mesh>
          <Text position={[0, 0, 10.5]} fontSize={0.5} color="blue">
            {formatFeatureName(selectedFeatures.z)}
          </Text>
        </group>
        
        {/* Track points */}
        {data.map((track) => (
          <TrackPoint 
            key={track.id}
            position={[
              (track[selectedFeatures.x] * 10) - 5,
              (track[selectedFeatures.y] * 10) - 5,
              (track[selectedFeatures.z] * 10) - 5
            ]}
            color={getClusterColor(track.cluster)}
            track={track}
            onHover={setHoveredTrack}
            onLeave={() => setHoveredTrack(null)}
          />
        ))}
        
        {/* Display tooltip for hovered track */}
        {hoveredTrack && (
          <TrackTooltip 
            track={hoveredTrack} 
            position={[
              (hoveredTrack[selectedFeatures.x] * 10) - 5,
              (hoveredTrack[selectedFeatures.y] * 10) - 5,
              (hoveredTrack[selectedFeatures.z] * 10) - 5
            ]} 
          />
        )}
        
        {/* Cluster centers */}
        {centers.map((center) => (
          <ClusterCenter 
            key={`center-${center.cluster_id}`}
            position={[
              (center[selectedFeatures.x] * 10) - 5,
              (center[selectedFeatures.y] * 10) - 5,
              (center[selectedFeatures.z] * 10) - 5
            ]}
            color={getClusterColor(center.cluster_id)}
            size={0.6}
          />
        ))}
        
        {/* Controls */}
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          rotateSpeed={0.5}
        />
      </Canvas>
      
      <InstructionsOverlay>
        Drag to rotate • Scroll to zoom • Right-click to pan
      </InstructionsOverlay>
    </VisualizationContainer>
  );
};

export default Visualization3D;