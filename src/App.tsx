import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserLogin, UserSignUp } from './security/AuthUser';
import NotFound from './NotFound';
import AuthRoute from './security/Auth/AuthRoute';
import UserProfileMainPanel from './security/AuthUser/UserProfileMain';
import { store } from './store';
import { Provider } from 'react-redux';
import { domainDataService } from './service';
import { DomainData } from './store/model/DomainData';
import { AutoBrandsContext } from './App.contexts';
import { MyVehiclesDashboard } from './feature/MyVehicles/Dashboard';
import VehicleResearchDashboard from './feature/VehicleResearch/Dashboard';

function bootstrapContext () {

  const [autoBrands, setAutoBrands] = useState<DomainData[]>([]);
  const autoBrandsContextProvider = useMemo(() => ({autoBrands, setAutoBrands}), [autoBrands, setAutoBrands]);

  useEffect(() => {
    domainDataService.getDomainData('automobile', 'brand').then(
      (response) => {
        setAutoBrands(response.data!);
      }
    );
  }, []);

  return autoBrandsContextProvider;
}

function App () {

  const contextProvider = bootstrapContext();

  return (
    <Provider store={store}>
      <AutoBrandsContext.Provider value={contextProvider}>
        <Routes>
          <Route path="/" element={<AuthRoute><MyVehiclesDashboard/></AuthRoute>} />
          <Route path="/lookup" element={<AuthRoute><VehicleResearchDashboard/></AuthRoute>} />
          <Route path="/user-profile" element={<AuthRoute><UserProfileMainPanel /></AuthRoute>} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/sign-up" element={<UserSignUp />} />
          <Route path="*" element={<NotFound />}/>
        </Routes>
      </AutoBrandsContext.Provider>
    </Provider>
  );
}

export default App;
