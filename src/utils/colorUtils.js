// src/utils/colorUtils.js
/**
 * Get color for a cluster
 */
export const getClusterColor = (clusterId) => {
    const colors = [
      '#4f46e5', // indigo-600
      '#10b981', // emerald-500
      '#ef4444', // red-500
      '#f59e0b', // amber-500
      '#8b5cf6', // violet-500
      '#06b6d4', // cyan-500
      '#ec4899', // pink-500
      '#f97316', // orange-500
      '#84cc16', // lime-500
      '#6366f1', // indigo-500
    ];
    
    return colors[clusterId % colors.length];
  };
  
  /**
   * Get a color that contrasts with the provided background color
   */
  export const getContrastColor = (hexColor) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white for dark colors, black for light colors
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };
  
  /**
   * Generate a gradient from two colors
   */
  export const generateGradient = (color1, color2, direction = 'to right') => {
    return `linear-gradient(${direction}, ${color1}, ${color2})`;
  };