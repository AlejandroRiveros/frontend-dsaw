import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { app, messaging } from './firebaseConfig';

// Eliminar la suscripción a notificaciones push y la solicitud de token
// onMessage(messaging, (payload) => {
//   console.log('Mensaje recibido:', payload);
//   alert(`Notificación: ${payload.notification.title} - ${payload.notification.body}`);
// });

// const requestNotificationPermission = async () => {
//   try {
//     const token = await getToken(messaging, { vapidKey: 'BL644jDhOupfFR80Pt4ow3g_5VLpNbpTPLSRB0AkOBnZ3rUIWQJ_7B1evgJRSCQ2Pa_LFX-_SLkkBWN7lHrwiYI' });
//     if (token) {
//       console.log('Token de notificación:', token);
//     } else {
//       console.warn('No se pudo obtener el token de notificación.');
//     }
//   } catch (error) {
//     console.error('Error al obtener el token de notificación:', error);
//   }
// };

// requestNotificationPermission();

const queryClient = new QueryClient();

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);