import React from 'react';
import { createRoot } from 'react-dom/client';
import { NotificationProvider } from './contexts/NotificationContext';
import App from './App';
import './index.css';
import './bootstrap';

createRoot(document.getElementById('root')).render(
    <NotificationProvider>
        <App />
    </NotificationProvider>
);
