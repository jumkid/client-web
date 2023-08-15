import React from 'react';
import VehicleProfileForm from './VehicleProfileForm';
import authenticationManager from '../../../../security/Auth/AuthenticationManager';
import { getTestJwtToken, testVehicleProfile } from '../../../../App.test';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import mockAxios from 'axios';
import { act, render, screen } from '@testing-library/react';
import { AutoBrandsContext, AutoBrandsValue } from '../../../../App.contexts';

//Configuring a mockStore
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('axios');
mockAxios.get = jest.fn().mockResolvedValue({status: 200, data: []});

describe(VehicleProfileForm, () => {

  beforeAll(() => {
    authenticationManager.updateToken(getTestJwtToken());
  });

  const store = mockStore({
    userVehicles: {
      currentVehicle: testVehicleProfile
    }
  });

  it('should render correctly', async () => {
    await act(async () => {

      const testDomainData = {id:1, industry:'automobile', name:'brand', value:'porsche'};
      const autoBrandsContextProvider:AutoBrandsValue = {
        autoBrands:[testDomainData],
        setAutoBrands:(domainData) => ({...domainData})
      };

      render(
        <Provider store={store}>
          <AutoBrandsContext.Provider value={autoBrandsContextProvider}>
            <VehicleProfileForm/>
          </AutoBrandsContext.Provider>
        </Provider>
      );
      expect(screen).toMatchSnapshot();
    });
  });
});
