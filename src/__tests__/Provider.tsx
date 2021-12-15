import { Timing } from '..';
import { resolveMiddleware } from '../Provider';
import {
  fixtureState,
  MIDDLEWARE_MUTATION,
  TestEnumActions,
  testMiddleware,
  TestState,
  TestStateKeys,
} from './fixtures/State';

describe('resolveMiddleware', () => {
  // TODO Test dispatch function in middleware

  const state = resolveMiddleware<
    TestState,
    TestState[keyof TestState]['state'],
    TestEnumActions
  >(
    Timing.After,
    fixtureState,
    {
      type: TestEnumActions.Change,
      payload: { test: 'abc' },
    },
    (key, action) => {
      //
    },
    testMiddleware,
  );

  it('should work', () => {
    expect(state[TestStateKeys.Test].state.test).toBe(MIDDLEWARE_MUTATION);
  });
});
