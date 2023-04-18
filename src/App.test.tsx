import { render, screen } from '@testing-library/react'
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App'
import authenticationManager from './security/Auth/AuthenticationManager';
import jwt from 'jsonwebtoken';
import { act } from 'react-dom/test-utils';
import { VehicleProfile } from './store/model/VehicleProfile';

describe(App, () => {
  beforeAll(() => {});
  beforeEach(() => {});

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

  afterAll(() => {});
  afterEach(() => {});
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

export const testVehicleProfile:VehicleProfile = {
  accessScope: 'public',
  id: undefined,
  make: 'Porsche',
  mediaGalleryId: undefined,
  model: '911',
  modelYear: 1974,
  modificationDate: '',
  name: 'Porsche 911',
  trimLevel: 'turbo',
  vehicleEngine: {
    name: '4.8l v8',
    type: 'v8',
    cylinder: 8,
    displacement: 4.8,
    fuelType: 'gasoline',
    horsepower: 500,
    horsepowerRpm: 3600,
    torque: 700,
    torqueRpm: 4000,
    manufacturerEngineCode: 'M515'
  },
  vehicleTransmission: {
    name: '8 speed tiptronic',
    type: 'AT',
    drivetrain: '',
    availability: '',
    automaticType: 'AMT',
    numberOfSpeeds: 8
  }
}
