import authenticationManager from '../Auth/AuthenticationManager';

interface IUserProfile {
  isAdmin: () => boolean
}

class UserProfile implements IUserProfile{

  isAdmin ():boolean {
    return authenticationManager.isAdmin();
  }

}

export default new UserProfile;