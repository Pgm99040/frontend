import { applyMiddleware, createStore,compose } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';
import throttle from 'lodash/throttle';
import {loadState, saveState } from './localStorage';
import rootReducer from './reducers/index';

const logger = createLogger();
const persistedState = loadState();

const defaultState = {
};

const middleware =  compose(
	applyMiddleware(routerMiddleware(browserHistory), thunk, logger),
	window.devToolsExtension ? window.devToolsExtension() : f => f
);

//const middleware =  applyMiddleware(routerMiddleware(browserHistory), thunk, logger);

const store = createStore( rootReducer, persistedState, middleware);

store.subscribe(throttle (() => {
	console.log('Store State: ', store.getState());
	saveState({
	})
}, 1000));

export const history = syncHistoryWithStore(browserHistory, store);

export default store;

