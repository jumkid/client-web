import React, { ReactNode } from 'react';
import UserProfile from '../AuthUser/UserProfile';

type Props = {
  children: ReactNode
}

function NoneAdminOnly (props:React.PropsWithChildren<Props>) {
  return (
    !UserProfile.isAdmin() ? <>{props.children}</> : null
  )
}

export default NoneAdminOnly;