
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home.js';
import Navbar from './components/Navbar';
import UserRegistration from './components/UserRegistration.js'
import PatientProfile from './components/PatientProfile.js';
import CreateDoctorProfile from './components/CreateDoctorProfile.js';
import "./index.css"
import DoctorProfile from './components/DoctorProfile.js';


function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<UserRegistration />} />
            <Route path="/patient-profile/:userId" element={<PatientProfile />} />
            <Route path='/create-doctor-profile/:userId' element={<CreateDoctorProfile />}/>
            <Route path='/doctor-profile/:doctorId' element={<DoctorProfile />}/>


          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
