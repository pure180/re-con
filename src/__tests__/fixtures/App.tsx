import React, { useCallback } from 'react';
import {
  fixtureState,
  AppStateProvider,
  useSelector,
  TestStateKeys,
  TestEnumActions,
  testMiddleware,
} from './State';

export const STATE_MUTATION = 'new_test_value';

export const TestChild: React.FunctionComponent = () => {
  const [testState, dispatchTestState] = useSelector(TestStateKeys.Test);

  const handleClick = useCallback(() => {
    dispatchTestState({
      type: TestEnumActions.Change,
      payload: { ...testState, test: STATE_MUTATION },
    });
  }, [dispatchTestState, testState]);

  return (
    <div>
      <p>{testState.test}</p>
      <button onClick={handleClick}>Test Button</button>
    </div>
  );
};

export const TestApp: React.FunctionComponent<{ withMiddleware?: boolean }> = ({
  withMiddleware,
}) => (
  <AppStateProvider
    state={fixtureState}
    middleware={withMiddleware ? testMiddleware : undefined}
  >
    <TestChild />
  </AppStateProvider>
);

export default TestApp;
