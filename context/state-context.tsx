import { Item, Person } from '@/assets/types';
import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';

interface StateContextType {
  items: Item[];
  people: Person[];
  updatePeople: (peopleList: Person[]) => void;
  updateItems: (itemsList: Item[]) => void;
  subtotal: number;
  total: number;
  tax: number;
}

const StateContext = createContext<StateContextType>({
  items: [],
  people: [],
  updatePeople: () => {},
  updateItems: () => {},
  subtotal: 0,
  total: 0,
  tax: 0,
});

export const StateProvider = ({children}: PropsWithChildren) => {
  const [peopleList, setPeopleList] = useState<Person[]>([]);
  const [itemsList, setItemsList] = useState<Item[]>([]);

  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);

  // Update subtotal, total, and tax when items change
  useEffect(() => {
    const newSubtotal = itemsList.reduce((sum, item) => sum + item.price, 0);
    setSubtotal(newSubtotal);
    const newTax = itemsList.reduce((sum, item) => sum + item.getTax(), 0)
    setTax(newTax);
    setTotal(newSubtotal + newTax);
  }, [itemsList]);

  const updatePeople = (peopleList: Person[]) => {
    setPeopleList(peopleList);
  };

  const updateItems = (itemsList: Item[]) => {
    setItemsList(itemsList);
  };

  return (
    <StateContext.Provider value={{
      items: itemsList,
      people: peopleList,
      updatePeople, 
      updateItems, 
      subtotal, 
      total, 
      tax
    }}>
      {children}
    </StateContext.Provider>
  );
};

export default StateContext;