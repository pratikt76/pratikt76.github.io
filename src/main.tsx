import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import PratikMinimalPortfolio from './PratikMinimalPortfolio';
import Notes from './Notes';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PratikMinimalPortfolio />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

