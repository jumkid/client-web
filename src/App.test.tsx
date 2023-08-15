import { render, screen } from '@testing-library/react'
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App'
import authenticationManager from './security/Auth/AuthenticationManager';
import jwt from 'jsonwebtoken';
import { VehicleProfile } from './store/model/VehicleProfile';
import { USER_ROLE } from './App.constants';
import * as C from './App.constants';

describe(App, () => {

  beforeAll(() => {
    authenticationManager.updateToken(getTestJwtToken());
  });

  beforeEach(() => {
    return;
  });

  it('renders user login screen', () => {
    renderWithRouter(<App />, {route: '/login'});
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

  afterAll(() => { return; });
  afterEach(() => { return; });
});

export const renderWithRouter = (ui:React.ReactElement, {route = '/'} = {}) => {
  window.history.pushState({}, 'Test page', route)

  return {
    ...render(ui, {wrapper: BrowserRouter})
  }
}

export const getTestJwtToken = ():string => {
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
      roles: [USER_ROLE]
    }
  };
  return jwt.sign(payload, secret);
}

export const testVehicleProfile:VehicleProfile = {
  id: 'dummy-id',
  name: 'porsche cayenne with techart magnum body kits',
  make: 'porsche',
  model: 'cayenne',
  modelYear: 2008,
  trimLevel: 'turbo',
  mediaGalleryId: null,
  accessScope: C.PUBLIC,
  vehicleEngine: {
    vehicleEngineId: 1,
    name: 'twin turbo v8',
    type: 'V8',
    cylinder: 8,
    displacement: 4.8,
    fuelType: 'gasoline',
    horsepower: 500,
    horsepowerRpm: 6600,
    torque: 800,
    torqueRpm: 5800,
    manufacturerEngineCode: 'M151'
  },
  vehicleTransmission: {
    vehicleTransmissionId: 1,
    name: 'tiptronic 6-speed',
    type: 'AMT',
    drivetrain: 'Full time AWD',
    availability: null,
    automaticType: 'AT',
    numberOfSpeeds: 6
  }
};