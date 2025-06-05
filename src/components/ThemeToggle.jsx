// src/components/ThemeToggle.jsx
import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const ToggleButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.isDark ? 'var(--color-background-alt)' : 'var(--color-background)'};
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
`;

const ThemeToggle = ({ isDark, toggleTheme }) => {
  return (
    <ToggleButton
      isDark={isDark}
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {isDark ? (
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ rotate: -45 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <path
            d="M12 3V4M12 20V21M21 12H20M4 12H3M18.364 18.364L17.657 17.657M6.343 6.343L5.636 5.636M18.364 5.636L17.657 6.343M6.343 17.657L5.636 18.364M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.svg>
      ) : (
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ rotate: 45 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <path
            d="M21.9548 13.3616C21.5033 16.3606 19.6333 19.1448 16.9144 20.5528C13.0144 22.5048 8.32631 21.1458 5.90431 17.8128C3.48231 14.4808 3.69231 9.67876 6.61531 6.61576C9.53831 3.55176 14.1213 2.88976 17.8763 4.89976C18.8173 5.409 19.6663 6.04986 20.3893 6.79786C20.2793 6.05786 20.0453 5.32786 19.6713 4.62586C18.2243 1.89786 15.3963 0.347859 12.3693 0.347859C7.29031 0.347859 3.28931 4.83386 3.28931 10.3219C3.28931 15.8099 7.29031 20.2969 12.3693 20.2969C16.1323 20.2969 19.4103 17.5959 20.6043 13.8229C20.8353 13.0979 20.9793 12.3459 21.0213 11.5759C21.0953 10.1379 20.8693 8.76786 20.3893 7.51786C21.4133 9.31786 21.9043 11.3079 21.9553 13.3609L21.9548 13.3616Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      )}
    </ToggleButton>
  );
};

export default ThemeToggle;