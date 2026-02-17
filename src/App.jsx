import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MisCupones } from './pages/MisCupones';
import { Home } from './pages/Home';


export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/mis-cupones" element={<MisCupones />} />
      </Routes>
    </Router>
  );
}

