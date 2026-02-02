import React, { createContext, useState, PropsWithChildren, useEffect } from 'react';
import { Person, Item, State } from '@/assets/types';
// import AsyncStorage from '@react-native-async-storage/async-storage';

interface StateContextType {
  state: State;
  items: Item[];
  people: Person[];
  updatePeople: (peopleList: Person[]) => void;
  updateItems: (itemsList: Item[]) => void;
}

const StateContext = createContext<StateContextType>({
  state: {people: [], items: []},
  items: [],
  people: [],
  updatePeople: (peopleList: Person[]) => {},
  updateItems: (itemsList: Item[]) => {},
});

export const StateProvider = ({children}: PropsWithChildren) => {
  const [peopleList, setPeopleList] = useState<Person[]>([]);
  const [itemsList, setItemsList] = useState<Item[]>([]);
  const [state, setState] = useState<State>({people: peopleList, items: itemsList});

  useEffect(() => {
    console.log('new people: ', peopleList.map(p => p.name), '\nnew items: ', itemsList.map(i => i.name));
    setState({
      people: peopleList,
      items: itemsList,
    });
  }, [peopleList, itemsList]);

  const updatePeople = (peopleList: Person[]) => {
    setPeopleList(peopleList);
  };

  const updateItems = (itemsList: Item[]) => {
    setItemsList(itemsList);
  };

  return (
    <StateContext.Provider value={{ state, items: itemsList, people: peopleList, updatePeople, updateItems }}>
      {children}
    </StateContext.Provider>
  );
};

export default StateContext;