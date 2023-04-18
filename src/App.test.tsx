import { render, screen } from '@testing-library/react'
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App'
import authenticationManager from './security/Auth/AuthenticationManager';
import jwt from 'jsonwebtoken';
import { act } from 'react-dom/test-utils';

describe(App, () => {
  beforeAll(() => {});
  beforeEach(() => {});
  afterAll(() => {});
  afterEach(() => {});

  it('renders user login screen', () => {
    renderWithRouter(<App />, {});
    expect(screen.getByText(/User Login/i)).toBeDefined();
  });

  it('renders user signup screen', () => {
    renderWithRouter(<App />, { route: '/sign-up' });
    expect(screen.getByText(/User Sign Up/i)).toBeDefined();
  });

  it('renders not found screen', () => {
    renderWithRouter(<App />, { route: '/dummy' });
    expect(screen.getByText(/Oops!/i)).toBeDefined();
  });

  it('renders user home screen', async () => {
    authenticationManager.updateToken(generateTestJwtToken());

    await act( async () => renderWithRouter(<App />, {}));
    expect(screen.getByText(/My Garage/i)).toBeDefined();
  });
});

export const renderWithRouter = (ui:React.ReactElement, {route = '/'} = {}) => {
  window.history.pushState({}, 'Test page', route)

  return {
    ...render(ui, {wrapper: BrowserRouter}),
  }
}

export const generateTestJwtToken = ():string => {
  const secret = 'mySecretKey';
  const payload = {
    scope: "roles profile email",
    sid: "81a2e5b2-5d69-4c13-8f20-c911584d899a",
    avatarId: "5jI5JYcBGav9X8XDeYAa",
    email_verified: false,
    name: "Jest Test",
    preferred_username: "test",
    given_name: "Jest",
    family_name: "Test",
    email: "test@jumkid.com",
    realm_access: {
      roles: ["USER_ROLE"]
    }
  };
  return jwt.sign(payload, secret);
}
