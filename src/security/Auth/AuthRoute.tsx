// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import authenticationManager from './AuthenticationManager';

interface Props {
  children: ReactNode
  path?: string
}

class AuthRoute extends React.Component {
  component:ReactNode = null;
  path:string | undefined = '';

  constructor (props:Props) {
    super(props);

    this.component = props.children;
    this.path = props.path;
  }

  render () {
    return (
      authenticationManager.isLoggedIn()
        ? this.component
        : <Navigate to='/login' state={{ from: this.path }} />
    );
  }
}

export default AuthRoute;
