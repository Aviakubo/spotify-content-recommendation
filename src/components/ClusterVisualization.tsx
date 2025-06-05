// src/components/ClusterVisualization.tsx
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { formatFeatureName } from '../utils/formatters';

// Define interfaces for our component props and data structures
interface DataPoint {
  id: string;
  name: string;
  artist: string;
  cluster: number;
  album_cover?: string;
  [key: string]: any; // For feature values like danceability, energy, etc.
}

interface ClusterCenter {
  cluster_id: number;
  [key: string]: any; // For feature values
}

interface ClusterVisualizationProps {
  data: DataPoint[];
  centers: ClusterCenter[];
  features: string[];
  onParameterChange: (params: { n_clusters: number; features: string[] }) => void;
}

interface TooltipContent {
  name: string;
  artist: string;
  cluster: number;
  [key: string]: any; // For additional feature values
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  content: TooltipContent | null;
}

// Styled Components
const VisualizationContainer = styled(motion.div)`
  width: 100%;
`;

const ControlsContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const ControlRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ControlColumn = styled.div`
  flex: 1;
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

const SVGContainer = styled.div`
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  background-color: var(--color-background);
`;

const TooltipContainer = styled.div`
  position: absolute;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.5rem;
  box-shadow: var(--shadow-md);
  pointer-events: none;
  z-index: 10;
  max-width: 200px;
`;

const StyledText = styled.p<{size?: string; weight?: string; mb?: string}>`
  font-size: ${props => props.size === 'sm' ? '0.875rem' : props.size === 'xs' ? '0.75rem' : '1rem'};
  font-weight: ${props => props.weight === 'bold' ? '700' : '400'};
  margin-bottom: ${props => props.mb || '0'};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const StyledButton = styled(motion.button)`
  padding: 0.625rem 1.25rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

// Visualization Component
const ClusterVisualization: React.FC<ClusterVisualizationProps> = ({ 
  data, 
  centers, 
  features, 
  onParameterChange 
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [xFeature, setXFeature] = useState<string>(features[0]);
  const [yFeature, setYFeature] = useState<string>(features[1]);
  const [numClusters, setNumClusters] = useState<number>(5);
  const [tooltip, setTooltip] = useState<TooltipState>({ 
    visible: false, 
    x: 0, 
    y: 0, 
    content: null 
  });
  
  // D3 visualization setup and rendering
  useEffect(() => {
    if (!data || !centers || !svgRef.current || !containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const width = Math.min(containerWidth, 800);
    const height = 500;
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    
    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
      
    // Create scales
    // Use type assertions to help TypeScript understand the d3.extent result
    const xExtent = d3.extent(data, d => d[xFeature] as number) as [number, number];
    const yExtent = d3.extent(data, d => d[yFeature] as number) as [number, number];
    
    const xScale = d3.scaleLinear()
      .domain([xExtent[0] - 0.1, xExtent[1] + 0.1])
      .range([margin.left, width - margin.right]);
      
    const yScale = d3.scaleLinear()
      .domain([yExtent[0] - 0.1, yExtent[1] + 0.1])
      .range([height - margin.bottom, margin.top]);
      
    // Create color scale for clusters
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    
    // Add axes
    const xAxis = d3.axisBottom(xScale);
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);
      
    const yAxis = d3.axisLeft(yScale);
    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);
      
    // Add axis labels
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .style("text-anchor", "middle")
      .style("fill", "var(--color-text)")
      .text(formatFeatureName(xFeature));
      
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", 15)
      .style("text-anchor", "middle")
      .style("fill", "var(--color-text)")
      .text(formatFeatureName(yFeature));
      
    // Add data points with transition
    const points = svg.selectAll(".data-point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "data-point")
      .attr("cx", d => xScale(d[xFeature] as number))
      .attr("cy", d => yScale(d[yFeature] as number))
      .attr("r", 0) // Start with radius 0 for animation
      .style("fill", d => colorScale(String(d.cluster)))
      .style("opacity", 0.7)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .attr("r", 8)
          .style("opacity", 1);
          
        // Show tooltip
        setTooltip({
          visible: true,
          x: event.pageX,
          y: event.pageY,
          content: {
            name: d.name,
            artist: d.artist,
            cluster: d.cluster,
            [xFeature]: (d[xFeature] as number).toFixed(2),
            [yFeature]: (d[yFeature] as number).toFixed(2)
          }
        });
      })
      .on("mousemove", function(event) {
        setTooltip(prev => ({
          ...prev,
          x: event.pageX,
          y: event.pageY
        }));
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("r", 5)
          .style("opacity", 0.7);
          
        // Hide tooltip
        setTooltip(prev => ({ ...prev, visible: false }));
      });
      
    // Animate points appearing
    points.transition()
      .duration(1000)
      .attr("r", 5);
      
    // Add cluster centers
    svg.selectAll(".cluster-center")
      .data(centers)
      .enter()
      .append("circle")
      .attr("class", "cluster-center")
      .attr("cx", d => xScale(d[xFeature] as number))
      .attr("cy", d => yScale(d[yFeature] as number))
      .attr("r", 0) // Start with radius 0 for animation
      .style("fill", d => colorScale(String(d.cluster_id)))
      .style("stroke", "var(--color-background)")
      .style("stroke-width", 2);
      
    // Animate cluster centers appearing
    svg.selectAll(".cluster-center")
      .transition()
      .duration(1000)
      .delay(1000) // Delay after points appear
      .attr("r", 10);
      
    // Add legend
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - margin.right - 100}, ${margin.top})`);
      
    const uniqueClusters = Array.from(new Set(data.map(d => d.cluster))).sort((a, b) => a - b);
    
    uniqueClusters.forEach((cluster, i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);
        
      legendRow.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 6)
        .style("fill", colorScale(String(cluster)));
        
      legendRow.append("text")
        .attr("x", 15)
        .attr("y", 5)
        .style("font-size", "12px")
        .style("fill", "var(--color-text)")
        .text(`Cluster ${cluster}`);
    });
      
  }, [data, centers, xFeature, yFeature]);
  
  // Handle parameter changes
  const handleParameterChange = () => {
    onParameterChange({
      n_clusters: numClusters,
      features: features
    });
  };
  
  return (
    <VisualizationContainer 
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ControlsContainer>
        <ControlRow>
          <ControlColumn>
            <Label>X-Axis Feature</Label>
            <select 
              value={xFeature}
              onChange={(e) => setXFeature(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {features.map((feature: string) => (
                <option key={`x-${feature}`} value={feature}>{formatFeatureName(feature)}</option>
              ))}
            </select>
          </ControlColumn>
          
          <ControlColumn>
            <Label>Y-Axis Feature</Label>
            <select 
              value={yFeature}
              onChange={(e) => setYFeature(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {features.map((feature: string) => (
                <option key={`y-${feature}`} value={feature}>{formatFeatureName(feature)}</option>
              ))}
            </select>
          </ControlColumn>
        </ControlRow>
        
        <div>
          <Label>
            Number of Clusters: {numClusters}
          </Label>
          <RangeInput 
            type="range" 
            min="2" 
            max="10" 
            value={numClusters}
            onChange={(e) => setNumClusters(parseInt(e.target.value))}
          />
        </div>
        
        <ButtonContainer>
          <StyledButton
            onClick={handleParameterChange}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Update Clustering
          </StyledButton>
        </ButtonContainer>
      </ControlsContainer>
      
      <SVGContainer>
        <svg ref={svgRef} width="100%" height="500px"></svg>
        {tooltip.visible && tooltip.content && (
          <TooltipContainer
            style={{
              left: tooltip.x + 10 + 'px',
              top: tooltip.y - 70 + 'px',
            }}
          >
            <StyledText size="sm" weight="bold" mb="0.25rem">{tooltip.content.name}</StyledText>
            <StyledText size="xs" mb="0.25rem">by {tooltip.content.artist}</StyledText>
            <StyledText size="xs" mb="0.25rem">Cluster: {tooltip.content.cluster}</StyledText>
            <StyledText size="xs" mb="0.25rem">{formatFeatureName(xFeature)}: {tooltip.content[xFeature]}</StyledText>
            <StyledText size="xs" mb="0">{formatFeatureName(yFeature)}: {tooltip.content[yFeature]}</StyledText>
          </TooltipContainer>
        )}
      </SVGContainer>
    </VisualizationContainer>
  );
};

export default ClusterVisualization;