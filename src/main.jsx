import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRoutes from '../src/routes/routes';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes/>
  </StrictMode>
);
