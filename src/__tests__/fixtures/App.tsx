import React, { useCallback } from 'react';
import {
  fixtureState,
  AppStateProvider,
  useSelector,
  TestStateKeys,
  TestEnumActions,
} from './State';

export const TestChild: React.FunctionComponent = () => {
  const [testState, dispatchTestState] = useSelector(TestStateKeys.Test);

  const handleClick = useCallback(() => {
    const test = 'new_test_value';
    dispatchTestState({
      type: TestEnumActions.Change,
      payload: { ...testState, test },
    });
  }, [dispatchTestState, testState]);

  return (
    <div>
      <p>{testState.test}</p>
      <button onClick={handleClick}>Test Button</button>
    </div>
  );
};

export const TestApp: React.FunctionComponent = () => (
  <AppStateProvider state={fixtureState}>
    <TestChild />
  </AppStateProvider>
);

export default TestApp;
