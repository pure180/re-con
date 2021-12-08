import { useContext, Context, useState, useEffect } from 'react';
import { AppState } from './Types';
import { ActionReturn, AppContextValue } from '.';

/**
 * Basic Selector hook to access the state context
 * @param {Context<AppContextValue<State, Item, ActionType>>} Context -
 *          The state Context object
 * @param {string} key - The key of the state property
 * @returns [AppState, (action: ActionReturn<ActionType, Item>) => void] -
 *          Returns a tuple of the selected state and the dispatch function
 */
export const useSelectorBase = <State extends Object, Item, ActionType>(
  Context: Context<AppContextValue<State, Item, ActionType>>,
  key: keyof State,
): [
  AppState<State, Item, ActionType>[keyof State]['state'],
  (action: ActionReturn<ActionType, Item>) => void,
] => {
  const { state: appState, dispatch: basicDispatch } = useContext(Context);

  const dispatch = (action: ActionReturn<ActionType, Item>) =>
    basicDispatch(key, action);

  const [{ state }, setState] = useState(appState[key]);

  useEffect(() => {
    setState(appState[key]);
  }, [appState, key]);

  return [state, dispatch];
};

/**
 * Creates the selector hook to access a property of the global state given by a key e.G.:
 * ```typescript
 * const useSelector = createSelectorHook(YourAppStateContext);
 * ```
 * @param {Context<AppContextValue<State, Item, ActionType>>} Context -
 *          The state Context object
 * @returns [AppState, (action: ActionReturn<ActionType, Item>) => void] -
 *          Returns a tuple of the selected state and the dispatch function
 */
export const createSelectorHook =
  <State extends Object, Item, ActionType>(
    Context: Context<AppContextValue<State, Item, ActionType>>,
  ) =>
  (key: keyof State) =>
    useSelectorBase(Context, key);
