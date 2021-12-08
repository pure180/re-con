import React, {
  PropsWithChildren,
  useState,
  Context as ContextType,
} from 'react';
import { Middleware, Timing } from '.';
import { ActionReturn, AppContextValue, AppState } from './Types';

export interface AppStateProviderProps<State, Item, ActionType> {
  log?: boolean;
  middleware?: Middleware<State, Item, ActionType>[];
  state: AppState<State, Item, ActionType>;
}

/**
 * Resolving the middleware to mutate the application state before or after
 * the reducer takes places.
 * @param {Timing} timing
 * @param {AppState} state
 * @param {ActionReturn} action
 * @param {Middleware[]} middleware
 * @returns {AppState}
 */
const resolveMiddleware = <State, Item, ActionType>(
  timing: Timing,
  state: AppState<State, Item, ActionType>,
  action: ActionReturn<ActionType, Item>,
  middleware: Middleware<State, Item, ActionType>[] = [],
): AppState<State, Item, ActionType> => {
  let newState = state;
  if (middleware && middleware.length) {
    middleware.forEach((middlewareFn) => {
      const [currentTiming, fn] = middlewareFn(state, action);
      if (timing === currentTiming && fn) {
        newState = fn();
      }
    });
  }

  return newState;
};

/**
 * Function to create the React App State Context Provider
 * @param {React.Context} Context
 * @returns {React.FunctionComponent}
 */
export const createAppStateProvider = <State extends Object, Item, ActionType>(
  Context: ContextType<AppContextValue<State, Item, ActionType>>,
) => {
  /**
   * @typedef {React.FunctionComponent} AppStateProvider - 
   * @param {PropsWithChildren<AppStateProviderProps>} props
   * @returns {React.FunctionComponent}
   */
  const Provider: React.FunctionComponent<
    PropsWithChildren<AppStateProviderProps<State, Item, ActionType>>
  > = ({ children, middleware, state }) => {
    if (!state) {
      throw new Error(
        "Can't find any default state please provide a default state.",
      );
    }

    const [value, setValue] =
      useState<AppState<State, Item, ActionType>>(state);

    const dispatch = (
      key: keyof State,
      action: ActionReturn<ActionType, Item>,
    ) => {
      if (!value[key]) {
        throw new Error(
          `Cant't find any provided state with the property key "${key}".`,
        );
      }

      const reducer = value[key].reducer;

      if (!reducer) {
        throw new Error(
          `Can't find any reducer matching the property key "${key}".`,
        );
      }

      setValue((prevState) => {
        prevState = resolveMiddleware(
          Timing.Before,
          prevState,
          action,
          middleware,
        );

        const state = reducer(prevState[key].state, action);

        prevState = {
          ...prevState,
          [key]: {
            ...prevState[key],
            state,
          },
        };

        prevState = resolveMiddleware(
          Timing.After,
          prevState,
          action,
          middleware,
        );

        return { ...prevState };
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
