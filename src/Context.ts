import { createContext, Context } from 'react';
import { AppState } from '.';
import { AppContextValue } from './Types';

/**
 * Creates the basic Application State Context;
 * @returns {Context<AppContextValue<State, Item, ActionType>>}
 */
export const createAppStateContext = <
  State extends Object,
  Item,
  ActionType,
>(): Context<AppContextValue<State, Item, ActionType>> =>
  createContext<AppContextValue<State, Item, ActionType>>({
    dispatch: (key, action) => {
      // Empty function
    },
    state: {} as AppState<State, Item, ActionType>,
  });
