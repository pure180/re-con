export { createAppStateProvider, AppStateProviderProps } from './Provider';
export * from './Context';
export * from './Hooks';
export * from './Types';

/**
 * @typedef {function} Action - Function type that describes an action.
 * @param {ActionType} type - the string / action type the reducer is acting on
 * @param {Payload} payload - Object that mutates the State.
 * @returns {ActionReturn}
 */

/**
 * @typedef  {Object} ActionReturn - Object describing the state change
 * @property {ActionType|string} type - the string / action type the reducer is acting on
 * @property {Payload} payload Object that mutates the state
 */

/**
 * @typedef {Object.<string, Action>} Actions
 */

/**
 * @typedef {Object} BaseState
 * @property {Reducer} reducer - the reducer to mutate the state
 * @property {Object|Array|String} state - the state object
 */

/**
 * Basic state object that gets mutated.
 * @typedef {Object.<string, BaseState>} AppState - Collection of all state objects
 */

/**
 * Default app state provider properties
 * @typedef {Object} AppStateProviderProps
 * @property {boolean} log - Should log the application state to the console.
 * @property {Middleware[]|undefined} middleware - Array of middleware functions that
 * @property {AppState} state - Object that holds the default state.
 */

/**
 * @typedef {Object} AppContextValue the default context properties
 * @property {function} dispatch -
 * @property {Array.<Middleware>|undefined} middleware
 * @property {AppState} state
 */

/**
 * @typedef {function} MiddlewareReturnFunction - the 2. argument that gets returned by the Middleware
 * @returns {AppState}
 */

/**
 * @typedef {function} Dispatch
 * @param {Action} action
 * @param {Object|Array|String} payload
 */

/**
 * @typedef {function} Middleware
 * @param {AppState} state the current state object
 * @param {ActionReturn} action the current action
 * @param {Dispatch} dispatch a callback function to mutate the state
 * @returns {Array<Timing, MiddlewareReturnFunction>}
 */

/**
 * @typedef {function} Reducer - Function type that describes the reducer
 * @param {State} state - state that can be mutated by the reducer.
 * @param {ActionReturn} action - Object that should mutate the state.
 */

/**
 * Enum describing the time an middleware should be called
 * @typedef Timing
 * @readonly
 * @enum {before|after}
 * @property {after} Timing.After
 * @property {before} Timing.Before
 */
