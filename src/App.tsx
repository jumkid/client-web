import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CarOwner } from './UserGarage/Dashboard';
import { Professional } from './ProfessionalGarage/Dashboard';
import { UserLogin, UserSignUp } from './UserLogin';
import NotFound from './NotFound';
import AuthRoute from './Auth/AuthRoute';

function App () {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthRoute><CarOwner /></AuthRoute>} />
        <Route path="/professional" element={<AuthRoute><Professional /></AuthRoute>} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/sign-up" element={<UserSignUp />} />
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </Router>
  );
}

export default App;
