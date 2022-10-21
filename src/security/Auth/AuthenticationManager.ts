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

class AuthenticationManager {
  jwtToken:string | null = null;
  jwtUser:JWTTokenUser | null = null;

  constructor () {
    let token = localStoredToken.get();
    if (!token) return;

    token = JSON.parse(token);
    this.#processToken(token);

    window.addEventListener('storage', (event) => {
      if (event.key === C.JWT_TOKEN_KEY) {
        let newToken = event.newValue;
        if (newToken) {
          newToken = JSON.parse(newToken);
          this.#processToken(newToken);
        }
        this.tokenUpdated(newToken);
      }
    }, false);

    setInterval(
      async () => await this.checkTokenExpiry(this)
      , 60000
    );
  }

  tokenUpdated (newToken:string | null) {
    this.jwtToken = newToken;
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

  #processToken (token:string | null) {
    if (!token) { return; }

    this.jwtToken = token;
    try {
      this.jwtUser = JwtDecode(token);
    } catch (error) {
      console.log(error);
      this.logout();
    }
  }

  updateToken (token:string | null) {
    this.jwtToken = token;
    if (token) {
      this.#processToken(token);
      localStoredToken.set(token);
    } else {
      localStoredToken.delete();
    }
  }

  getTokenUser () {
    return this.jwtUser;
  }

  getAccessToken () {
    const result = localStoredToken.get();
    if (!result) { return null; }
    return JSON.parse(result);
  }

  getRefreshToken () {
    const result = localStoredToken.get();
    if (!result) {
      return '';
    }
    return JSON.parse(result).refreshToken;
  }

  isLoggedIn () {
    console.log(`is user logged in: ${!!this.getAccessToken()}`);
    return !!this.getAccessToken();
  }

  logout () {
    this.updateToken(null);
  }
}

export default new AuthenticationManager();
