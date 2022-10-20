const _API_URL: string = process.env.REACT_APP_API_GATEWAY_HOST!;

export const USER_LOGIN_API: string = _API_URL + process.env.REACT_APP_USER_LOGIN_API;
export const USER_SIGNUP_API: string = _API_URL + process.env.REACT_APP_USER_LOGIN_API;
export const USER_TOKEN_REFRESH_API: string = _API_URL + process.env.REACT_APP_USER_TOKEN_REFRESH_API;
export const USER_VEHICLES_API: string = _API_URL + process.env.REACT_APP_USER_VEHICLES_API;
export const CONTENT_THUMBNAIL_API: string = _API_URL + process.env.REACT_APP_CONTENT_THUMBNAIL_API;

export const USERNAME = 'username';
export const PASSWORD = 'password';

export const JWT_TOKEN_KEY = 'jwToken';
