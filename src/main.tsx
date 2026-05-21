import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css'; 
import App from './app/App'; 

const container = document.getElementById('root');

if (!container) {
  throw new Error('[System] Root container missing'); 
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);