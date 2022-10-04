import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';

function App () {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard.CarOwner />} />
        <Route path="/professional" element={<Dashboard.Professional />} />
        <Route path="/login" element={<h1>Login here ...</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
