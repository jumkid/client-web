import JwtDecode from 'jwt-decode';
import * as C from '../../App.constants';
import authenticationService from '../../service/AuthenticationService';
import { JWTTokenUser } from './model/JWTTokenUser';
import { ADMIN_ROLE } from '../../App.constants';
import { AuthResponse } from '../../service/model/Response';

const localStoredToken = {
  get: ():string | null => {
    return window.localStorage.getItem(C.JWT_TOKEN_KEY);
  },
  getRefreshToken (): string | null {
    return window.localStorage.getItem(C.JWT_REFRESH_TOKEN_KEY);
  },
  set: (token:string):void => {
    window.localStorage.setItem(C.JWT_TOKEN_KEY, JSON.stringify(token));
  },
  setRefreshToken: (refreshToken:string):void => {
    window.localStorage.setItem(C.JWT_REFRESH_TOKEN_KEY, JSON.stringify(refreshToken));
  },
  delete: ():void => {
    window.localStorage.removeItem(C.JWT_TOKEN_KEY);
    window.localStorage.removeItem(C.JWT_REFRESH_TOKEN_KEY);
  }
};

export interface IAuthenticationManager {
  checkTokenExpiry(self:AuthenticationManager):Promise<void>
  getTokenUserId():string | undefined
  getAccessToken():string
  getRefreshToken():string
  updateToken (token:string | null):void
  updateRefreshToken (token:string | null):void
  updateTokenUserAvatar(avatarId:string):void
  isLoggedIn():boolean
  isAdmin():boolean
  login(username?:string, password?:string):Promise<AuthResponse>
  logout():void
}

export class AuthenticationManager implements IAuthenticationManager{
  jwtToken:string | null = null;
  jwtRefreshToken:string | null = null;
  jwtUser:JWTTokenUser | null = null;
  isAdminRole = false;

  keepAliveInterval = ():ReturnType<typeof setInterval> => {
    return setInterval(async () => {
      await this.checkTokenExpiry(this);
    }, 30000);
  };

  constructor () {
    let token = localStoredToken.get();
    if (!token) {
      return;
    }

    token = JSON.parse(token);
    this.#processToken(token!);
  }

  async checkTokenExpiry (self:AuthenticationManager) {
    if (self.jwtUser && self.jwtUser.exp) {
      const now = Math.floor(Date.now() / 1000);
      const expired = (self.jwtUser.exp - now) < 14100;
      if (expired) {
        console.log(`refresh token ...`);
        try {
          const {data: {access_token, refresh_token}} = await authenticationService.refresh(self.getRefreshToken());
          self.updateToken(access_token);
          self.updateRefreshToken(refresh_token);
        } catch (error) {
          self.updateToken(null);
          window.location.href = '/login';
        }
      }
    }
    return await Promise.resolve();
  }

  #processToken (token:string) {
    this.jwtToken = token;
    try {
      this.jwtUser = JwtDecode(token);
      this.isAdminRole = this.jwtUser!.realm_access.roles.findIndex(role => role === ADMIN_ROLE) > -1;
    } catch (error) {
      console.error(error);
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

  getAccessToken(): string {
    const token = localStoredToken.get();
    if (!token) { return ''; }
    return JSON.parse(token);
  }

  getRefreshToken(): string {
    const token = localStoredToken.getRefreshToken();
    if (!token) { return ''; }
    return JSON.parse(token);
  }

  updateToken(token:string | null): void {
    this.jwtToken = token;
    if (token) {
      this.#processToken(token);
      localStoredToken.set(token);
    } else {
      localStoredToken.delete();
    }
  }

  updateRefreshToken(token:string | null): void {
    if (token) {
      localStoredToken.setRefreshToken(token);
    } else {
      localStoredToken.delete();
    }
  }

  updateTokenUserAvatar(avatarId: string): void {
    if (this.jwtUser) {
      this.jwtUser.avatarId = avatarId;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  isAdmin(): boolean {
    return this.isAdminRole;
  }

  async login(username?: string | undefined, password?: string | undefined): Promise<AuthResponse> {
    const response = await authenticationService.signIn(username, password);

    if (response.isSuccess) {
      this.updateToken(response.data.access_token);
      this.updateRefreshToken(response.data.refresh_token);
    }

    return response;
  }

  logout(): void {
    this.updateToken(null);
    this.updateRefreshToken(null);
  }
}

export default new AuthenticationManager();
