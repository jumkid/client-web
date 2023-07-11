const _API_URL: string = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_GATEWAY_HOST! : "http://localhost";

export const IDLE = "idle";
export const LOADING = "loading";
export const SUCCEEDED = "succeeded";
export const FAILED = "failed";

export const DEFAULT_PAGE_SIZE = 10;

export const RIGHT = 'RIGHT';
export const LEFT = 'LEFT';

export const PUBLIC = 'public';
export const PRIVATE = 'private';

export const USERNAME = 'username';
export const PASSWORD = 'password';
export const JWT_TOKEN_KEY = 'jwToken';
export const USER_ROLE = 'USER_ROLE';
export const ADMIN_ROLE = 'ADMIN_ROLE';

export const MODE_SIMPLE = 'simple';
export const MODE_ACTIVE = 'active';

export const DATETIME_FORMAT_NO_SECOND = 'YYYY-MM-DDTHH:mm';
export const DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
export const DATE_FORMAT = 'YYYY-MM-DD';

export const USER_API:string = _API_URL + process.env.REACT_APP_USER_API;
export const USER_LOGIN_API:string = _API_URL + process.env.REACT_APP_USER_LOGIN_API;
export const USER_SIGNUP_API:string = _API_URL + process.env.REACT_APP_USER_SIGNUP_API;
export const USER_TOKEN_REFRESH_API:string = _API_URL + process.env.REACT_APP_USER_TOKEN_REFRESH_API;

export const VEHICLES_API:string = _API_URL + process.env.REACT_APP_VEHICLES_API;
export const VEHICLES_SAVE_AS_NEW_API:string = _API_URL + process.env.REACT_APP_VEHICLES_SAVE_AS_NEW_API;
export const VEHICLES_SEARCH_API:string = _API_URL + process.env.REACT_APP_VEHICLES_SEARCH_API;
export const VEHICLES_PUBLIC_SEARCH_API:string = _API_URL + process.env.REACT_APP_VEHICLES_PUBLIC_SEARCH_API;
export const VEHICLES_MATCHERS_SEARCH_API:string = _API_URL + process.env.REACT_APP_VEHICLES_MATCHERS_SEARCH_API;
export const VEHICLES_AGG_SEARCH_API:string = _API_URL + process.env.REACT_APP_VEHICLES_AGG_SEARCH_API;
export const VEHICLE_VIN_DECODE_API:string = _API_URL + process.env.REACT_APP_VEHICLE_VIN_DECODE_API;

export const CONTENT_METADATA_API:string = _API_URL + process.env.REACT_APP_CONTENT_METADATA_API;
export const CONTENT_UPLOAD_API:string = _API_URL + process.env.REACT_APP_CONTENT_UPLOAD_API;
export const CONTENT_DOWNLOAD_API:string = _API_URL + process.env.REACT_APP_CONTENT_DOWNLOAD_API;
export const CONTENT_THUMBNAIL_API:string = _API_URL + process.env.REACT_APP_CONTENT_THUMBNAIL_API;
export const CONTENT_STREAM_API:string = _API_URL + process.env.REACT_APP_CONTENT_STREAM_API;
export const CONTENT_GALLERY_API:string = _API_URL + process.env.REACT_APP_CONTENT_GALLERY_API;

export const ACTIVITY_API:string = _API_URL + process.env.REACT_APP_ACTIVITY_API;
export const ACTIVITIES_API:string = _API_URL + process.env.REACT_APP_ACTIVITIES_API;
export const ACTIVITY_CONTENT_API:string = _API_URL + process.env.REACT_APP_ACTIVITY_CONTENT_API;

export const USER_ACTIVITY_NOTIFICATION_API:string = _API_URL + process.env.REACT_APP_USER_ACTIVITY_NOTIFICATION_API;

export const DOMAIN_IMAGES_API:string = _API_URL + process.env.REACT_APP_DOMAIN_IMAGE_API;
export const DOMAIN_IMAGES_AUTO_BRAND_API:string = DOMAIN_IMAGES_API + '/automobile/brand';

export const VEHICLE = 'vehicle';
export const MAKE = 'make';
export const MODEL = 'model';
export const MODEL_YEAR = 'modelYear';
export const TRIM_LEVEL = 'trimLevel';
export const VIN = 'vin';
export const SUBMIT = 'submit';