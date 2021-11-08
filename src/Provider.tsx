import React, {
  PropsWithChildren,
  useState,
  Context as ContextType,
} from 'react';
import { ActionReturn, AppContextValue, AppState } from './Types';

/**
 *
 * @param Context
 * @returns
 */
export const createAppStateProvider = <State extends Object, Item, ActionType>(
  Context: ContextType<AppContextValue<State, Item, ActionType>>,
) => {
  const Provider: React.FunctionComponent<
    PropsWithChildren<{ state: AppState<State, Item, ActionType> }>
  > = ({ children, state }) => {
    const [value, setValue] =
      useState<AppState<State, Item, ActionType>>(state);

    const dispatch = (
      key: keyof State,
      action: ActionReturn<ActionType, Item>,
    ) => {
      const reducer = value[key].reducer;

      if (!reducer) {
        throw new Error('No Reducer');
      }

      setValue((prevState) => {
        const state = reducer(prevState[key].state, action);

        return {
          ...prevState,
          [key]: {
            ...prevState[key],
            state,
          },
        };
      });
    };

    return (
      <Context.Provider
        value={{
          dispatch,
          state: value,
        }}
      >
        {children}
      </Context.Provider>
    );
  };

  return Provider;
};
