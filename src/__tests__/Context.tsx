import React from 'react';
import { unmountComponentAtNode, render } from 'react-dom';

import { act } from 'react-dom/test-utils';
import TestApp from './fixtures/App';
import { fixtureState, TestStateKeys } from './fixtures/State';

const Fixture: React.FunctionComponent = () => <TestApp />;

describe('Context', () => {
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
