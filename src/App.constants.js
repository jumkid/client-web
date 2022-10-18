const _API_URL = process.env.REACT_APP_API_GATEWAY_HOST;

const constants = {
  API_URL: _API_URL,

  USER_LOGIN_API: _API_URL + process.env.REACT_APP_USER_LOGIN_API,
  USER_SIGNUP_API: _API_URL + process.env.REACT_APP_USER_LOGIN_API,
  USER_TOKEN_REFRESH_API: _API_URL + process.env.REACT_APP_USER_TOKEN_REFRESH_API,

  USERNAME: 'username',
  PASSWORD: 'password',

  USER_VEHICLES_API: _API_URL + process.env.REACT_APP_USER_VEHICLES_API,

  JWT_TOKEN_KEY: 'jwtToken'
};

export default constants;
