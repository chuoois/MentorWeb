import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/app-router';
import { Toaster } from 'react-hot-toast';
import './index.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
const GOOGLE_CLIENT_ID = '336215184651-cmdc1suusjin1la435uuov2t2vciiv5r.apps.googleusercontent.com';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </GoogleOAuthProvider>
  </React.StrictMode>
);