// src/utils/formatters.js
/**
 * Format a feature name for display
 * Converts camelCase to Title Case
 */
export const formatFeatureName = (name) => {
    return name
      .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .trim(); // Remove any extra spaces
  };
  
  /**
   * Format a value based on its type
   */
  export const formatValue = (value, type = 'number') => {
    switch (type) {
      case 'percent':
        return `${(value * 100).toFixed(0)}%`;
      case 'decimal':
        return value.toFixed(2);
      default:
        return value;
    }
  };