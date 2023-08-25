import React, { createContext } from 'react';

type ContextValue = {
  connectorStep: number
  setConnectorStep: React.Dispatch<React.SetStateAction<number>>
}

export const VehicleConnectorContext = createContext<ContextValue>({
  connectorStep: 0,
  setConnectorStep: (step) => step
})

