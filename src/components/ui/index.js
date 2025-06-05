// src/components/ui/index.js
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Layout Components
export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

export const Flex = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'stretch'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  gap: ${props => props.gap || '0'};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.cols || 1}, 1fr);
  gap: ${props => props.gap || '1rem'};
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(${props => props.colsSm || props.cols || 1}, 1fr);
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(${props => props.colsMd || props.colsSm || props.cols || 1}, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(${props => props.colsLg || props.colsMd || props.colsSm || props.cols || 1}, 1fr);
  }
`;

// Typography
export const Heading = styled.h1`
  font-size: ${props => {
    switch (props.size) {
      case 'xl': return '2.25rem';
      case 'lg': return '1.875rem';
      case 'md': return '1.5rem';
      case 'sm': return '1.25rem';
      case 'xs': return '1.125rem';
      default: return '1.5rem';
    }
  }};
  font-weight: 700;
  color: ${props => props.color || 'var(--color-text)'};
  margin-bottom: ${props => props.mb || '0.5rem'};
`;

export const Text = styled.p`
  font-size: ${props => {
    switch (props.size) {
      case 'lg': return '1.125rem';
      case 'sm': return '0.875rem';
      case 'xs': return '0.75rem';
      default: return '1rem';
    }
  }};
  font-weight: ${props => props.weight || 'normal'};
  color: ${props => props.color || 'var(--color-text)'};
  margin-bottom: ${props => props.mb || '1rem'};
`;

// Interactive Elements
export const Button = styled(motion.button)`
  padding: ${props => props.size === 'sm' ? '0.5rem 1rem' : props.size === 'lg' ? '0.875rem 1.75rem' : '0.625rem 1.25rem'};
  font-size: ${props => props.size === 'sm' ? '0.875rem' : props.size === 'lg' ? '1.125rem' : '1rem'};
  background-color: ${props => {
    if (props.variant === 'outline') return 'transparent';
    if (props.variant === 'ghost') return 'transparent';
    return props.color || 'var(--color-primary)';
  }};
  color: ${props => {
    if (props.variant === 'outline' || props.variant === 'ghost') return props.color || 'var(--color-primary)';
    return 'white';
  }};
  border: ${props => {
    if (props.variant === 'outline') return `1px solid ${props.color || 'var(--color-primary)'}`;
    return 'none';
  }};
  border-radius: var(--radius-md);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: ${props => {
      if (props.variant === 'outline') return 'rgba(79, 70, 229, 0.1)';
      if (props.variant === 'ghost') return 'rgba(79, 70, 229, 0.1)';
      return 'var(--color-primary-dark)';
    }};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Card = styled.div`
  background-color: var(--color-background);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: ${props => props.padding || '1.5rem'};
  overflow: hidden;
  border: 1px solid var(--color-border);
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  outline: none;
  transition: var(--transition);
  background-color: var(--color-background);
  color: var(--color-text);

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  outline: none;
  transition: var(--transition);
  background-color: var(--color-background);
  color: var(--color-text);

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }
`;

// Data Visualization Components
export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background-color: ${props => props.color ? `${props.color}20` : 'var(--color-primary)'};
  color: ${props => props.color || 'white'};
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: var(--color-background-alt);
  border-radius: 9999px;
  overflow: hidden;

  &:after {
    content: '';
    display: block;
    width: ${props => props.value || 0}%;
    height: 100%;
    background-color: ${props => props.color || 'var(--color-primary)'};
    border-radius: 9999px;
    transition: width 0.5s ease;
  }
`;