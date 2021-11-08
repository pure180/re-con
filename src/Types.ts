export type ActionReturn<ActionType, Payload> = {
  type: ActionType;
  payload: Payload;
};

export type Action<ActionType, Payload> = (
  type: ActionType,
  payload: Payload,
) => ActionReturn<ActionType, Payload>;

export type Actions<ActionType, Payload> = {
  [key: string]: Action<ActionType, Payload>;
};

export type Reducer<State, ActionType> = (
  state: State,
  action: ActionReturn<ActionType, State>,
) => State;

export interface BaseState<State, ActionType> {
  reducer: Reducer<State, ActionType>;
  state: State;
}

export type AppState<State extends Object, Item, ActionType> = {
  [key in keyof State]: BaseState<Item, ActionType>;
};

export interface AppContextValue<State extends Object, Item, ActionType> {
  state: AppState<State, Item, ActionType>;
  dispatch: (key: keyof State, action: ActionReturn<ActionType, Item>) => void;
}
