import { createContext, useState } from 'react';
import { Person, Item, State } from '@/assets/types';

// const [state, setState] = useState(State);
export const stateContext = createContext(State);
