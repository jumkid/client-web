import JwtDecode from 'jwt-decode';
import * as C from '../../App.constants';
import authenticationService from '../../service/AuthenticationService';
import { JWTTokenUser } from './model/JWTTokenUser';

const localStoredToken = {
  get: ():string | null => {
    return window.localStorage.getItem(C.JWT_TOKEN_KEY);
  },
  set: (token:string):void => {
    window.localStorage.setItem(C.JWT_TOKEN_KEY, JSON.stringify(token));
  },
  delete: ():void => {
    window.localStorage.removeItem(C.JWT_TOKEN_KEY);
  }
};

export interface IAuthenticationManager {
  checkTokenExpiry(self:AuthenticationManager):Promise<void>
  getTokenUserId():string | undefined
  getAccessToken():string | null
  getRefreshToken():string
  updateToken (token:string | null):void
  updateTokenUserAvatar(avatarId:string):void
  isLoggedIn():true | false
  logout():void
}

export class AuthenticationManager implements IAuthenticationManager{
  jwtToken:string | null = null;
  jwtUser:JWTTokenUser | null = null;

  constructor () {
    let token = localStoredToken.get();
    if (!token) return;

    token = JSON.parse(token);
    this.#processToken(token!);

    setInterval(
      async () => await this.checkTokenExpiry(this)
      , 60000
    );
  }

  async checkTokenExpiry (self:AuthenticationManager) {
    if (self.jwtUser && self.jwtUser.exp) {
      const expired = self.jwtUser.exp < (Date.now() - 1000 * 60 * 5) / 1000;
      if (expired) {
        authenticationService.refresh(self.getRefreshToken())
          .then(
            (response) => { self.updateToken(response.data.access_token); }
          )
          .catch(() => {
            self.updateToken(null);
            window.location.href = '/login';
          });
      }
    }
    return await Promise.resolve();
  }

  #processToken (token:string) {
    this.jwtToken = token;
    try {
      this.jwtUser = JwtDecode(token);
    } catch (error) {
      console.log(error);
      this.logout();
    }
  }

  getTokenUserId (): string | undefined {
    return this.jwtUser?.sub;
  }

  getTokenUserAvatar (): string | undefined {
    return this.jwtUser?.avatarId;
  }

  getTokenUserName (): string | undefined {
    return this.jwtUser?.preferred_username;
  }

  getAccessToken(): string | null {
    const result = localStoredToken.get();
    if (!result) { return null; }
    return JSON.parse(result);
  }

  getRefreshToken(): string {
    const result = localStoredToken.get();
    if (!result) {
      return '';
    }
    return JSON.parse(result).refreshToken;
  }

  updateToken (token:string | null): void {
    this.jwtToken = token;
    if (token) {
      this.#processToken(token);
      localStoredToken.set(token);
    } else {
      localStoredToken.delete();
    }
  }

  updateTokenUserAvatar(avatarId: string): void {
    console.log("updated token user avatar");
    if (this.jwtUser) this.jwtUser.avatarId = avatarId;
  }

  isLoggedIn(): true | false {
    console.log(`is user logged in: ${!!this.getAccessToken()}`);
    return !!this.getAccessToken();
  }

  logout(): void {
    this.updateToken(null);
  }
}

export default new AuthenticationManager();