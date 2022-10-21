import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CarOwner } from './feature/UserGarage/Dashboard';
import { Professional } from './feature/ProfessionalGarage/Dashboard';
import { UserLogin, UserSignUp } from './security/AuthUser';
import NotFound from './NotFound';
import AuthRoute from './security/Auth/AuthRoute';
import UserProfileMainPanel from './security/AuthUser/UserProfileMain';

function App () {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthRoute><CarOwner /></AuthRoute>} />
        <Route path="/professional" element={<AuthRoute><Professional /></AuthRoute>} />
        <Route path="/user-profile" element={<AuthRoute><UserProfileMainPanel /></AuthRoute>} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/sign-up" element={<UserSignUp />} />
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </Router>
  );
}

export default App;
