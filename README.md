# React Context Application State Management

**This package is WIP**

This package provides a basic functionality to manage your react application state with the Facebook house made context API.

# Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Usage](#usage)
- [Functions](#functions)
- [Typedefs](#typedefs)
- [Timing : <code>enum</code>](#timing--codeenumcode)
- [createAppStateContext() ⇒ <code>Context.&lt;AppContextValue.&lt;State, Item, ActionType&gt;&gt;</code>](#createappstatecontext-%E2%87%92-codecontextltappcontextvalueltstate-item-actiontypegtgtcode)
- [useSelectorBase(Context, key) ⇒](#useselectorbasecontext-key-%E2%87%92)
- [createSelectorHook(Context) ⇒](#createselectorhookcontext-%E2%87%92)
- [resolveMiddleware(timing, state, action, middleware) ⇒ <code>AppState</code>](#resolvemiddlewaretiming-state-action-middleware-%E2%87%92-codeappstatecode)
- [createAppStateProvider(Context) ⇒ <code>React.FunctionComponent</code>](#createappstateprovidercontext-%E2%87%92-codereactfunctioncomponentcode)
- [Action ⇒ <code>ActionReturn</code>](#action-%E2%87%92-codeactionreturncode)
- [ActionReturn : <code>Object</code>](#actionreturn--codeobjectcode)
- [Actions : <code>Object.&lt;string, Action&gt;</code>](#actions--codeobjectltstring-actiongtcode)
- [BaseState : <code>Object</code>](#basestate--codeobjectcode)
- [AppState : <code>Object.&lt;string, BaseState&gt;</code>](#appstate--codeobjectltstring-basestategtcode)
- [AppStateProviderProps : <code>Object</code>](#appstateproviderprops--codeobjectcode)
- [AppContextValue : <code>Object</code>](#appcontextvalue--codeobjectcode)
- [MiddlewareReturnFunction ⇒ <code>AppState</code>](#middlewarereturnfunction-%E2%87%92-codeappstatecode)
- [Middleware ⇒ <code>Array.&lt;Timing, MiddlewareReturnFunction&gt;</code>](#middleware-%E2%87%92-codearraylttiming-middlewarereturnfunctiongtcode)
- [Reducer : <code>function</code>](#reducer--codefunctioncode)
- [AppStateProvider ⇒ <code>React.FunctionComponent</code>](#appstateprovider-%E2%87%92-codereactfunctioncomponentcode)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

> npm i @pure180/re-con

or

> yarn add @pure180/re-con

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
} from '@pure180/re-con';

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

// Create the application Context which we will use later to create the
// provider or gaining access to the whole State-Context object of your
// application.
export const AppContext = createAppStateContext<
  State,
  State[keyof State]['state'],
  EnumActions
>();

// Create the application state provider that gives the react element
// children the ability to access the application state.
export const AppStateProvider = createAppStateProvider<
  State,
  State[keyof State]['state'],
  EnumActions
>(AppContext);

// Create the selector hook which is able to access one state object
// including the dispatch function.
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

## Functions

<dl>
<dt><a href="#createAppStateContext">createAppStateContext()</a> ⇒ <code>Context.&lt;AppContextValue.&lt;State, Item, ActionType&gt;&gt;</code></dt>
<dd><p>Creates the basic Application State Context;</p></dd>
<dt><a href="#useSelectorBase">useSelectorBase(Context, key)</a> ⇒</dt>
<dd><p>Basic Selector hook to access the state context</p></dd>
<dt><a href="#createSelectorHook">createSelectorHook(Context)</a> ⇒</dt>
<dd><p>Creates the selector hook to access a property of the global state given by a key e.G.:</p>
<pre class="prettyprint source lang-typescript"><code>const useSelector = createSelectorHook(YourAppStateContext);
</code></pre></dd>
<dt><a href="#resolveMiddleware">resolveMiddleware(timing, state, action, middleware)</a> ⇒ <code><a href="#AppState">AppState</a></code></dt>
<dd><p>Resolving the middleware to mutate the application state before or after
the reducer takes places.</p></dd>
<dt><a href="#createAppStateProvider">createAppStateProvider(Context)</a> ⇒ <code>React.FunctionComponent</code></dt>
<dd><p>Function to create the React App State Context Provider</p></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Action">Action</a> ⇒ <code><a href="#ActionReturn">ActionReturn</a></code></dt>
<dd><p>Function type that describes an action.</p></dd>
<dt><a href="#ActionReturn">ActionReturn</a> : <code>Object</code></dt>
<dd><p>Object describing the state change</p></dd>
<dt><a href="#Actions">Actions</a> : <code>Object.&lt;string, Action&gt;</code></dt>
<dd></dd>
<dt><a href="#BaseState">BaseState</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#AppState">AppState</a> : <code>Object.&lt;string, BaseState&gt;</code></dt>
<dd><p>Basic state object that gets mutated.</p></dd>
<dt><a href="#AppStateProviderProps">AppStateProviderProps</a> : <code>Object</code></dt>
<dd><p>Default app state provider properties</p></dd>
<dt><a href="#AppContextValue">AppContextValue</a> : <code>Object</code></dt>
<dd><p>the default context properties</p></dd>
<dt><a href="#MiddlewareReturnFunction">MiddlewareReturnFunction</a> ⇒ <code><a href="#AppState">AppState</a></code></dt>
<dd><p>the 2. argument that gets returned by the Middleware</p></dd>
<dt><a href="#Middleware">Middleware</a> ⇒ <code>Array.&lt;Timing, MiddlewareReturnFunction&gt;</code></dt>
<dd></dd>
<dt><a href="#Reducer">Reducer</a> : <code>function</code></dt>
<dd><p>Function type that describes the reducer</p></dd>
<dt><a href="#AppStateProvider">AppStateProvider</a> ⇒ <code>React.FunctionComponent</code></dt>
<dd><ul>
<li></li>
</ul></dd>
</dl>

<a name="Timing"></a>

## Timing : <code>enum</code>
<p>Enum describing the time an middleware should be called</p>

**Kind**: global enum  
**Read only**: true  
<a name="createAppStateContext"></a>

## createAppStateContext() ⇒ <code>Context.&lt;AppContextValue.&lt;State, Item, ActionType&gt;&gt;</code>
<p>Creates the basic Application State Context;</p>

**Kind**: global function  
<a name="useSelectorBase"></a>

## useSelectorBase(Context, key) ⇒
<p>Basic Selector hook to access the state context</p>

**Kind**: global function  
**Returns**: <p>[AppState, (action: ActionReturn&lt;ActionType, Item&gt;) =&gt; void] -
Returns a tuple of the selected state and the dispatch function</p>  

| Param | Type | Description |
| --- | --- | --- |
| Context | <code>Context.&lt;AppContextValue.&lt;State, Item, ActionType&gt;&gt;</code> | <p>The state Context object</p> |
| key | <code>string</code> | <p>The key of the state property</p> |

<a name="createSelectorHook"></a>

## createSelectorHook(Context) ⇒
<p>Creates the selector hook to access a property of the global state given by a key e.G.:</p>
<pre class="prettyprint source lang-typescript"><code>const useSelector = createSelectorHook(YourAppStateContext);
</code></pre>

**Kind**: global function  
**Returns**: <p>[AppState, (action: ActionReturn&lt;ActionType, Item&gt;) =&gt; void] -
Returns a tuple of the selected state and the dispatch function</p>  

| Param | Type | Description |
| --- | --- | --- |
| Context | <code>Context.&lt;AppContextValue.&lt;State, Item, ActionType&gt;&gt;</code> | <p>The state Context object</p> |

<a name="resolveMiddleware"></a>

## resolveMiddleware(timing, state, action, middleware) ⇒ [<code>AppState</code>](#AppState)
<p>Resolving the middleware to mutate the application state before or after
the reducer takes places.</p>

**Kind**: global function  

| Param | Type |
| --- | --- |
| timing | [<code>Timing</code>](#Timing) | 
| state | [<code>AppState</code>](#AppState) | 
| action | [<code>ActionReturn</code>](#ActionReturn) | 
| middleware | [<code>Array.&lt;Middleware&gt;</code>](#Middleware) | 

<a name="createAppStateProvider"></a>

## createAppStateProvider(Context) ⇒ <code>React.FunctionComponent</code>
<p>Function to create the React App State Context Provider</p>

**Kind**: global function  

| Param | Type |
| --- | --- |
| Context | <code>React.Context</code> | 

<a name="Action"></a>

## Action ⇒ [<code>ActionReturn</code>](#ActionReturn)
<p>Function type that describes an action.</p>

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>ActionType</code> | <p>the string / action type the reducer is acting on</p> |
| payload | <code>Payload</code> | <p>Object that mutates the State.</p> |

<a name="ActionReturn"></a>

## ActionReturn : <code>Object</code>
<p>Object describing the state change</p>

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>ActionType</code> \| <code>string</code> | <p>the string / action type the reducer is acting on</p> |
| payload | <code>Payload</code> | <p>Object that mutates the state</p> |

<a name="Actions"></a>

## Actions : <code>Object.&lt;string, Action&gt;</code>
**Kind**: global typedef  
<a name="BaseState"></a>

## BaseState : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| reducer | [<code>Reducer</code>](#Reducer) | <p>the reducer to mutate the state</p> |
| state | <code>Object</code> \| <code>Array</code> \| <code>String</code> | <p>the state object</p> |

<a name="AppState"></a>

## AppState : <code>Object.&lt;string, BaseState&gt;</code>
<p>Basic state object that gets mutated.</p>

**Kind**: global typedef  
<a name="AppStateProviderProps"></a>

## AppStateProviderProps : <code>Object</code>
<p>Default app state provider properties</p>

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| log | <code>boolean</code> | <p>Should log the application state to the console.</p> |
| middleware | [<code>Array.&lt;Middleware&gt;</code>](#Middleware) \| <code>undefined</code> | <p>Array of middleware functions that</p> |
| state | [<code>AppState</code>](#AppState) | <p>Object that holds the default state.</p> |

<a name="AppContextValue"></a>

## AppContextValue : <code>Object</code>
<p>the default context properties</p>

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| dispatch | <code>function</code> | <ul> <li></li> </ul> |
| middleware | [<code>Array.&lt;Middleware&gt;</code>](#Middleware) \| <code>undefined</code> |  |
| state | [<code>AppState</code>](#AppState) |  |

<a name="MiddlewareReturnFunction"></a>

## MiddlewareReturnFunction ⇒ [<code>AppState</code>](#AppState)
<p>the 2. argument that gets returned by the Middleware</p>

**Kind**: global typedef  
<a name="Middleware"></a>

## Middleware ⇒ <code>Array.&lt;Timing, MiddlewareReturnFunction&gt;</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| state | [<code>AppState</code>](#AppState) | <p>the current state object</p> |
| action | [<code>ActionReturn</code>](#ActionReturn) | <p>the current action</p> |

<a name="Reducer"></a>

## Reducer : <code>function</code>
<p>Function type that describes the reducer</p>

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>State</code> | <p>state that can be mutated by the reducer.</p> |
| action | [<code>ActionReturn</code>](#ActionReturn) | <p>Object that should mutate the state.</p> |

<a name="AppStateProvider"></a>

## AppStateProvider ⇒ <code>React.FunctionComponent</code>
<ul>
<li></li>
</ul>

**Kind**: global typedef  

| Param | Type |
| --- | --- |
| props | [<code>PropsWithChildren.&lt;AppStateProviderProps&gt;</code>](#AppStateProviderProps) | 

