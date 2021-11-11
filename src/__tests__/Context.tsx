/* eslint-disable react/prop-types */
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import { createAppStateContext } from '../Context';
import { createAppStateProvider } from '../Provider';
import { AppContextValue, AppState } from '../Types';
import TestApp from './fixtures/App';
import { fixtureState, TestStateKeys } from './fixtures/State';

const Fixture: React.FunctionComponent = () => <TestApp />;
describe('Test Context-API', () => {
  describe('Basic component rendering', () => {
    let container: HTMLDivElement | null;
    let paragraph: HTMLParagraphElement | null | undefined;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);

      act(() => {
        render(<Fixture />, container);
      });

      paragraph = container?.querySelector('p');
    });

    afterEach(() => {
      if (container) {
        unmountComponentAtNode(container);
        container.remove();
      }
      container = null;
    });

    it('renders with fully initialized application state', () => {
      expect(paragraph?.textContent).toBe(
        fixtureState[TestStateKeys.Test].state.test,
      );
    });

    it('changes the application state and renders the correct value', () => {
      const button = container?.querySelector('button');

      expect(button?.innerHTML).toBe('Test Button');

      act(() => {
        button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      paragraph = container?.querySelector('p');

      expect(paragraph?.textContent).toBe('new_test_value');
      expect(paragraph?.textContent).not.toBe(
        fixtureState[TestStateKeys.Test].state.test,
      );
    });
  });

  describe('Functionality and Context consumer rendering', () => {
    let container: HTMLDivElement | null;
    let Context: React.Context<AppContextValue<Object, unknown, unknown>>;
    let Provider: React.FunctionComponent<
      React.PropsWithChildren<{
        state: AppState<Object, unknown, unknown>;
      }>
    >;

    const testString = 'It Works';
    let TestComponent: React.FunctionComponent<{ renderConsumer: boolean }>;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);

      Context = createAppStateContext();
      Provider = createAppStateProvider(Context);

      // eslint-disable-next-line react/display-name
      TestComponent = ({ renderConsumer }) => (
        <Provider state={fixtureState as AppState<Object, unknown, unknown>}>
          {!renderConsumer && <>{testString}</>}
          {renderConsumer && (
            <Context.Consumer>
              {(ctx) => <>{typeof ctx.dispatch}</>}
            </Context.Consumer>
          )}
        </Provider>
      );
    });

    afterEach(() => {
      if (container) {
        unmountComponentAtNode(container);
        container.remove();
      }
      container = null;
    });

    it('should create the context object without errors', () => {
      expect(Context.Provider.$$typeof.toString()).toBe(
        'Symbol(react.provider)',
      );
      expect(Context.Consumer.$$typeof.toString()).toBe(
        'Symbol(react.context)',
      );
    });

    it('should render the previously created provider without errors', () => {
      act(() => {
        render(<TestComponent renderConsumer={false} />, container);
      });

      expect(container?.textContent).toBe(testString);
    });

    it('should render the context consumer without errors', () => {
      act(() => {
        render(<TestComponent renderConsumer={true} />, container);
      });

      expect(container?.textContent).toBe('function');
    });
  });
});
