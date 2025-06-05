// src/utils/animations.js
/**
 * Generate a random delay for staggered animations
 */
export const randomDelay = (min = 0, max = 1) => {
    return Math.random() * (max - min) + min;
  };
  
  /**
   * Generate a spring transition config with random stiffness/damping
   */
  export const randomSpring = () => {
    return {
      type: 'spring',
      stiffness: Math.random() * 100 + 200,
      damping: Math.random() * 10 + 10
    };
  };
  
  /**
   * Create a staggered animation for children elements
   */
  export const staggerChildren = (delay = 0.05) => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay
      }
    }
  });
  
  /**
   * Child animation for staggered animations
   */
  export const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };