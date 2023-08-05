import React, { createContext } from 'react';

export type TabsContextValue = {
  currentTab: number
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>
}

export const SideTabsContext = createContext<TabsContextValue>({
  currentTab: 0,
  setCurrentTab: (tab) => ({tab})
});
