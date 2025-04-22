import React, { createContext, useState, PropsWithChildren, useEffect } from 'react';
import { Person, Item, State } from '@/assets/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StateContextType {
  state: State;
  clearState: () => void;
}

const StateContext = createContext<StateContextType>({
  state: {people: [], items: []},
  clearState: () => {}
});

export const StateProvider = ({children}: PropsWithChildren) => {
  const [state, setState] = useState<State>({people: [], items: []});

  // Load previous state if it exists.
  useEffect(() => {
    async function loadState() {
      try {
        const savedState = await AsyncStorage.getItem('state');
        if (savedState !== null) {
          setState(JSON.parse(savedState));
        }
      } catch (_) {
        setState({people: [], items: []});
      }
    }
    loadState();
  }, []);

  const clearState = () => {
    setState({people: [], items: []});
  }

  return (
    <StateContext.Provider value={{ state, clearState }}>
      {children}
    </StateContext.Provider>
  );
};

export default StateContext;