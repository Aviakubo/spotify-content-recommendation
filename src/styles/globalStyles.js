// src/styles/globalStyles.js
import { createGlobalStyle } from 'styled-components';
import { lightTheme, darkTheme } from './theme';

const GlobalStyle = createGlobalStyle`
  :root {
    /* Use theme variables based on current theme */
    --color-primary: ${props => props.theme === 'dark' ? darkTheme.primary : lightTheme.primary};
    --color-primary-dark: ${props => props.theme === 'dark' ? darkTheme.primaryDark : lightTheme.primaryDark};
    --color-secondary: ${props => props.theme === 'dark' ? darkTheme.secondary : lightTheme.secondary};
    --color-secondary-dark: ${props => props.theme === 'dark' ? darkTheme.secondaryDark : lightTheme.secondaryDark};
    --color-text: ${props => props.theme === 'dark' ? darkTheme.text : lightTheme.text};
    --color-text-light: ${props => props.theme === 'dark' ? darkTheme.textLight : lightTheme.textLight};
    --color-background: ${props => props.theme === 'dark' ? darkTheme.background : lightTheme.background};
    --color-background-alt: ${props => props.theme === 'dark' ? darkTheme.backgroundAlt : lightTheme.backgroundAlt};
    --color-border: ${props => props.theme === 'dark' ? darkTheme.border : lightTheme.border};
    --color-error: ${props => props.theme === 'dark' ? darkTheme.error : lightTheme.error};
    --color-success: ${props => props.theme === 'dark' ? darkTheme.success : lightTheme.success};
    --color-warning: ${props => props.theme === 'dark' ? darkTheme.warning : lightTheme.warning};
    
    /* Common variables for both themes */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --transition: 0.2s ease-in-out;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.5;
    color: var(--color-text);
    background-color: var(--color-background);
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 0.5em;
  }

  p {
    margin-bottom: 1em;
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  a {
    color: var(--color-primary);
    text-decoration: none;
  }

  /* Animations */
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Loader */
  .loader {
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-top: 3px solid var(--color-primary);
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
  }
`;

export default GlobalStyle;
