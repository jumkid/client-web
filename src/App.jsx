import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import UserLogin from './UserLogin';
import NotFound from './NotFound';
import AuthRoute from './Auth/AuthRoute';

function App () {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<AuthRoute><Dashboard.CarOwner /></AuthRoute>} />
        <Route exact path="/professional" element={<AuthRoute><Dashboard.Professional /></AuthRoute>} />
        <Route exact path="/login" element={<UserLogin />} />
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </Router>
  );
}

export default App;
