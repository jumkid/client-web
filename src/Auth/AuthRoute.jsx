// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import authenticationManager from './AuthenticationManager';

class AuthRoute extends React.Component {
  constructor (props) {
    super(props);

    this.component = props.children;
    this.path = props.path;
  }

  render () {
    return (
      authenticationManager.isLoggedIn()
        ? this.component
        : <Navigate to={{ pathname: '/login', state: { from: this.path } }}/>
    );
  }
}

AuthRoute.propTypes = {
  children: PropTypes.object.isRequired,
  path: PropTypes.string
};

export default AuthRoute;
