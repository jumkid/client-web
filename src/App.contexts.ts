import React, { createContext } from 'react';
import { DomainData } from './store/model/DomainData';

export type AutoBrandsValue = {
  autoBrands: DomainData[]
  setAutoBrands: React.Dispatch<React.SetStateAction<DomainData[]>>
}

export const AutoBrandsContext = createContext<AutoBrandsValue>({
  autoBrands: [],
  setAutoBrands: (domainData) => ({...domainData})
});