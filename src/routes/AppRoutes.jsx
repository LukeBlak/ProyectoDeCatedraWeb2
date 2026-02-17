import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {MisCupones} from '../pages/MisCupones';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* ... otras rutas ... */}
      <Route path="/mis-cupones" element={<MisCupones />} />
    </Routes>
  );
};
