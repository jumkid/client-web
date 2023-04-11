// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React, { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import authenticationManager from './AuthenticationManager';
import { AppDispatch } from '../../store';
import { fetchUserProfile, setUserId, updateUserProfile } from '../../store/tokenUserSlice';
import { useAppDispatch } from '../../App.hooks';

type Props = {
  children: ReactNode
  path?: string
}

function AuthRoute (props:React.PropsWithChildren<Props>) {
  const dispatch = useAppDispatch();

  const isLoggedIn = authenticationManager.isLoggedIn();
  const userId = authenticationManager.getTokenUserId();

  const initiateUserProfileAction = (userId:string) => {
    return async (dispatch: AppDispatch) => {
      dispatch(setUserId(userId));
      const payload = await dispatch(fetchUserProfile(userId));
      dispatch(updateUserProfile(payload));
    }
  }

  useEffect(()=>{
    if (isLoggedIn && userId) {
      dispatch(initiateUserProfileAction(userId));
    }
  },[userId, isLoggedIn]);


  return (
    isLoggedIn
      ? <>{props.children}</>
      : <Navigate to='/login' state={{ from: props.path }} />
  );
}

export default AuthRoute;
