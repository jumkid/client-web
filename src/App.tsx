import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CarOwner } from './feature/CustomerGarage/Dashboard';
import { Professional } from './feature/ProfessionalGarage/Dashboard';
import { UserLogin, UserSignUp } from './security/AuthUser';
import NotFound from './NotFound';
import AuthRoute from './security/Auth/AuthRoute';
import UserProfileMainPanel from './security/AuthUser/UserProfileMain';
import { store } from './store';
import { Provider } from 'react-redux';

function App () {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<AuthRoute><CarOwner/></AuthRoute>} />
        <Route path="/professional" element={<AuthRoute><Professional /></AuthRoute>} />
        <Route path="/user-profile" element={<AuthRoute><UserProfileMainPanel /></AuthRoute>} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/sign-up" element={<UserSignUp />} />
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </Provider>
  );
}

export default App;
