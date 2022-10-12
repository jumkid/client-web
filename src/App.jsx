import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CarOwner, Professional } from './Dashboard';
import { UserLogin, UserSignUp } from './UserLogin';
import NotFound from './NotFound';
import AuthRoute from './Auth/AuthRoute';
import './App.css';

function App () {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<AuthRoute><CarOwner /></AuthRoute>} />
        <Route exact path="/professional" element={<AuthRoute><Professional /></AuthRoute>} />
        <Route exact path="/login" element={<UserLogin />} />
        <Route exact path="/sign-up" element={<UserSignUp />} />
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </Router>
  );
}

export default App;
