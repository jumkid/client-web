import React, { createContext } from 'react';

type ContextValue = {
  searchStep: number
  setSearchStep: React.Dispatch<React.SetStateAction<number>>
}

export const AdvanceSearchContext = createContext<ContextValue>({
  searchStep: 0,
  setSearchStep: (step) => step
})