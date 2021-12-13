export type Action<ActionType, Payload> = (
  type: ActionType,
  payload: Payload,
) => ActionReturn<ActionType, Payload>;

export type Actions<ActionType, Payload> = {
  [key: string]: Action<ActionType, Payload>;
};

export type ActionReturn<ActionType, Payload> = {
  type: ActionType;
  payload: Payload;
};

export interface AppContextValue<State extends Object, Item, ActionType> {
  dispatch: (key: keyof State, action: ActionReturn<ActionType, Item>) => void;
  middleware?: Middleware<State, Item, ActionType>[];
  state: AppState<State, Item, ActionType>;
}

export type AppState<State extends Object, Item, ActionType> = {
  [key in keyof State]: BaseState<Item, ActionType>;
};

export interface BaseState<State, ActionType> {
  reducer: Reducer<State, ActionType>;
  state: State;
}

export type Middleware<State extends Object, Item, ActionType> = (
  state: AppState<State, Item, ActionType>,
  action: ActionReturn<ActionType, Item>,
) => [Timing, () => AppState<State, Item, ActionType>];

export type Reducer<State, ActionType> = (
  state: State,
  action: ActionReturn<ActionType, State>,
) => State;

export enum Timing {
  Before = 'before',
  After = 'after',
}
