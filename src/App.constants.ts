const _API_URL: string = process.env.REACT_APP_API_GATEWAY_HOST!;

export const DEFAULT_PAGE_SIZE = 10;

export const USERNAME = 'username';
export const PASSWORD = 'password';
export const JWT_TOKEN_KEY = 'jwToken';

export const USER_API:string = _API_URL + process.env.REACT_APP_USER_API;
export const USER_LOGIN_API:string = _API_URL + process.env.REACT_APP_USER_LOGIN_API;
export const USER_SIGNUP_API:string = _API_URL + process.env.REACT_APP_USER_LOGIN_API;
export const USER_TOKEN_REFRESH_API:string = _API_URL + process.env.REACT_APP_USER_TOKEN_REFRESH_API;

export const VEHICLES_API:string = _API_URL + process.env.REACT_APP_VEHICLES_API;
export const VEHICLES_SEARCH_API:string = _API_URL + process.env.REACT_APP_VEHICLES_SEARCH_API;
export const VEHICLES_PUBLIC_SEARCH_API:string = _API_URL + process.env.REACT_APP_VEHICLES_PUBLIC_SEARCH_API;
export const VEHICLES_MATCHERS_SEARCH_API:string = _API_URL + process.env.REACT_APP_VEHICLES_MATCHERS_SEARCH_API;
export const VEHICLES_AGG_SEARCH_API:string = _API_URL + process.env.REACT_APP_VEHICLES_AGG_SEARCH_API;

export const CONTENT_UPLOAD_API:string = _API_URL + process.env.REACT_APP_CONTENT_UPLOAD_API;
export const CONTENT_THUMBNAIL_API:string = _API_URL + process.env.REACT_APP_CONTENT_THUMBNAIL_API;

export const DOMAIN_IMAGES_API:string = _API_URL + process.env.REACT_APP_DOMAIN_IMAGE_API;
export const DOMAIN_IMAGES_AUTO_BRAND_API:string = DOMAIN_IMAGES_API + '/automobile/brand';