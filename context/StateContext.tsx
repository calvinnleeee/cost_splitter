import React, { createContext, useState, PropsWithChildren, useEffect } from 'react';
import { Person, Item, State } from '@/assets/types';
// import AsyncStorage from '@react-native-async-storage/async-storage';

interface StateContextType {
  state: State;
  updatePeople: (peopleList: Person[]) => void;
  updateItems: (itemsList: Item[]) => void;
}

const StateContext = createContext<StateContextType>({
  state: {people: [], items: []},
  updatePeople: (peopleList: Person[]) => {},
  updateItems: (itemsList: Item[]) => {},
});

export const StateProvider = ({children}: PropsWithChildren) => {
  const [peopleList, setPeopleList] = useState<Person[]>([]);
  const [itemsList, setItemsList] = useState<Item[]>([]);
  const [state, setState] = useState<State>({people: peopleList, items: itemsList});

  useEffect(() => {
    setState({
      people: peopleList,
      items: itemsList,
    });
  }, [peopleList, itemsList]);

  const updatePeople = (peopleList: Person[]) => {
    setPeopleList(_ => peopleList);
  };

  const updateItems = (itemsList: Item[]) => {
    setItemsList(_ => itemsList);
  };

  return (
    <StateContext.Provider value={{ state, updatePeople, updateItems }}>
      {children}
    </StateContext.Provider>
  );
};

export default StateContext;