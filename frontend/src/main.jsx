/* eslint-disable no-unused-vars */
import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './components/Mainlayout.jsx'
import Patientlogin from './patient/Patientlogin.jsx'
import Patientsignup from './patient/Patientsignup.jsx'
import Doctorlogin from './doctor/Doctorlogin.jsx'
import Doctorsignup from './doctor/Doctorsignup.jsx'
import ReactDOM from 'react-dom/client';
import Patientdashboard from './patient/Patientdashboard.jsx'
import { AuthProvider } from './components/AuthContext.jsx'
import Doctordashboard from './doctor/Doctordashboard.jsx'
import { LanguageProvider } from '../LanguageContext.jsx'
import HealthPortal from './ui/HealthPortal.jsx'
import Homepage from './ui/Homepage.jsx'
import Services from './ui/Services.jsx'
import AshaAI from './components/AshaAi.jsx'
import UploadImage from './components/UploadImage.jsx'
import Cureskin from './components/Cureskin.jsx'
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Use MainLayout as the wrapper
  },
  { path: "/", element: <App /> },
  { path: "/homepage", element: <Homepage /> },
  { path: "/plogin", element: <Patientlogin /> },
  { path: "/psignup", element: <Patientsignup /> },
  { path: "/dlogin", element: <Doctorlogin /> },
  { path: "/dsignup", element: <Doctorsignup /> },
  { path: "/pdashboard", element: <Patientdashboard /> },
  { path: "/ddashboard", element: <Doctordashboard /> },
  {path: "/healthportal", element: <HealthPortal />},
  {path:"/services", element:<Services/>},
  {path:"/ashaai", element:<AshaAI/>},
  {path:"/visionanalyze", element:<UploadImage/>},
  {path:"/cureskin", element:<Cureskin/>},
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
     <AuthProvider>
    <LanguageProvider>
    
      <RouterProvider router={router} />
   
    </LanguageProvider>
    </AuthProvider>
  </React.StrictMode>
);
