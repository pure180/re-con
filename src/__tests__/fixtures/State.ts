import { createSelectorHook } from '../../Hooks';
import { createAppStateProvider } from '../../Provider';
import { createAppStateContext } from '../../Context';
import { AppState, BaseState, Middleware, Timing } from '../..';

export enum TestStateKeys {
  Test = 'test',
}

export enum TestEnumActions {
  Change = 'change',
}

export type TestStateObject = { test: string };

export interface TestState {
  [TestStateKeys.Test]: BaseState<TestStateObject, TestEnumActions>;
}

export const AppContext = createAppStateContext<
  TestState,
  TestState[keyof TestState]['state'],
  TestEnumActions
>();

export const AppStateProvider = createAppStateProvider<
  TestState,
  TestState[keyof TestState]['state'],
  TestEnumActions
>(AppContext);

export const useSelector = (key: keyof TestState) =>
  createSelectorHook(AppContext)(key);

export const fixtureState: AppState<
  TestState,
  TestState[keyof TestState]['state'],
  TestEnumActions
> = {
  [TestStateKeys.Test]: {
    reducer: (state, action) => {
      switch (action.type) {
        case TestEnumActions.Change:
          return {
            ...state,
            ...action.payload,
          };
        default:
          return state;
      }
    },
    state: {
      test: 'test_value',
    },
  },
};

export const MIDDLEWARE_MUTATION = 'middleware_mutation';

export const testMiddlewareAfterMutation: Middleware<
  TestState,
  TestState[keyof TestState]['state'],
  TestEnumActions
> = (state, action, dispatch) => [
  Timing.After,
  () => {
    if (action.type === TestEnumActions.Change) {
      state[TestStateKeys.Test].state.test = MIDDLEWARE_MUTATION;
    }
    return state;
  },
];

export const testMiddleware: Middleware<
  TestState,
  TestState[keyof TestState]['state'],
  TestEnumActions
>[] = [testMiddlewareAfterMutation];
