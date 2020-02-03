import { createStore, applyMiddleware, Store as ReduxStore } from 'redux';
import thunk from 'redux-thunk';
import RelativeRankedShow from '../types/relative-ranked-show';
import App from './reducers';

export interface RelativeRankedStore {
  shows: RelativeRankedShow[];
}

const store = createStore(App, { shows: [] }, applyMiddleware(thunk));
export default store;
