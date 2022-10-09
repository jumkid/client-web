import JwtDecode from 'jwt-decode';
import C from '../App.constants';
import authenticationService from '../service/AuthenticationService';

const localStoredToken = {
  get: () => {
    return window.localStorage.getItem(C.JWT_TOKEN_KEY);
  },
  set: (token) => {
    window.localStorage.setItem(C.JWT_TOKEN_KEY, JSON.stringify(token));
  },
  delete: () => {
    window.localStorage.removeItem(C.JWT_TOKEN_KEY);
  }
};

export class AuthenticationManager {
  constructor () {
    console.log('initiate authentication for current user');

    this.jwtToken = null;
    this.jwtUser = null;

    let token = localStoredToken.get();
    if (token) {
      token = JSON.parse(localStoredToken.get());
    }
    this.#processToken(token);

    window.addEventListener('storage', (event) => {
      if (event.key === C.JWT_TOKEN_KEY) {
        let newToken = event.newValue;
        if (newToken) {
          newToken = JSON.parse(newToken);
        }

        this.#processToken(newToken);
        this.tokenUpdated(newToken);
      }
    }, false);

    setInterval(
      () => this.checkTokenExpiry(this)
      , 60000
    );
  };

  tokenUpdated (newToken) {
    this.jwtToken = newToken;
  };

  checkTokenExpiry (_this) {
    if (!_this) {
      _this = this;
    }
    if (_this.jwtUser != null) {
      const expired = _this.jwtUser.exp < (Date.now() - 1000 * 60 * 5) / 1000;
      if (expired) {
        authenticationService.refresh(_this.getRefreshToken())
          .then(
            (newToken) => { _this.updateToken(newToken); }
          )
          .catch(() => {
            _this.updateToken(null);
            window.location.href = '/login';
          });
      }
    }
    return Promise.resolve();
  };

  #processToken (token) {
    if (!token) {
      return;
    }
    this.jwtToken = token;
    try {
      this.jwtUser = JwtDecode(token);
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  updateToken (token) {
    this.jwtToken = token;
    this.#processToken(token);
    if (token) {
      localStoredToken.set(token);
    } else {
      localStoredToken.delete();
    }
  };

  getTokenUser () {
    return this.jwtUser;
  };

  getAccessToken () {
    const result = localStoredToken.get();
    if (!result) { return null; }
    return JSON.parse(result);
  };

  getRefreshToken () {
    const result = localStoredToken.get();
    if (!result) {
      return '';
    }
    return JSON.parse(result).refreshToken;
  };

  isLoggedIn () {
    console.log(`is user logged in ${!!this.getAccessToken()}`);
    return !!this.getAccessToken();
  };

  logout () {
    this.updateToken(null);
  };
}

export default new AuthenticationManager();
