# React Context Application State Management

**This package is WIP**

This package provides a basic functionality to manage your react application state with the Facebook house made context API.

## Installation

> npm i re-con

or

> yarn add re-con

## Usage

Create a file for all configurations that controls the state handling.

e.g.: `./src/State.ts`

```typescript
import {
  AppState,
  BaseState,
  createAppStateContext,
  createAppStateProvider,
  createSelectorHook,
} from 're-con';

// Enum values which describes all available state properties
export enum StateKeys {
  Item = 'item',
}

// Enum values that describes the actions for on reducer
export enum EnumActions {
  Change = 'change',
}

// Describes one state object
export type StateObject = {
  item: string;
};

// Describes the hole state object including the reducer.
export interface State {
  [StateKeys.Item]: BaseState<StateObject, EnumActions>;
}

// Create the application Context which we will use later to create the provider or gaining access to the whole State-Context object of your application.
export const AppContext = createAppStateContext<
  State,
  State[keyof State]['state'],
  EnumActions
>();

// Create the application state provider that gives the react element children the ability to access the application state.
export const AppStateProvider = createAppStateProvider<
  State,
  State[keyof State]['state'],
  EnumActions
>(AppContext);

// Create the selector hook which is able to access one state object including the dispatch function.
export const useSelector = (key: keyof State) =>
  createSelectorHook(AppContext)(key);

// Create a default state including your reducer
export const defaultState: AppState<
  State,
  State[keyof State]['state'],
  EnumActions
> = {
  [StateKeys.Item]: {
    reducer: (state, action) => {
      switch (action.type) {
        case EnumActions.Change:
          return {
            ...state,
            ...action.payload,
          };
        default:
          return state;
      }
    },
    state: {
      item: 'myValue',
    },
  },
};
```

Apply the State Context Provider to your application.

e.g.: `./src/index.tsx`

```typescript
import React, { useCallback } from 'react';

import {
  AppStateProvider,
  defaultState,
  EnumActions,
  StateKeys,
  useSelector,
} from './State';

const ComponentWithSelectorHook: React.FunctionComponent = () => {
  const [state, dispatch] = useSelector(StateKeys.Item);

  const handleClick = useCallback(() => {
    const item = 'New Item Value';

    dispatch({
      type: EnumActions.Change,
      payload: { ...state, item },
    });
  }, [dispatch, state]);

  return (
    <div>
      <p>{state.item}</p>
      <button onClick={handleClick}>Click to change the State</button>
    </div>
  );
};

export const AppWithStateContextProvider: React.FunctionComponent = () => (
  <AppStateProvider state={defaultState}>
    <ComponentWithSelectorHook />
  </AppStateProvider>
);

export default AppWithStateContextProvider;
```
