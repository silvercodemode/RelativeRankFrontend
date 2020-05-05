import { createStore, applyMiddleware, Store } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import MainReducer from './reducers';

export interface RelativeRankedShow {
  name: string;
  rank: number;
  percentileRank: number;
}

export interface User {
  username: string;
  token: string;
  showList: RelativeRankedShow[];
  showListChangeMarker: symbol;
}

export interface PagedShowList {
  page: number;
  pageSize: number;
  numberOfPages: number;
  results: RelativeRankedShow[];
}

export interface RelativeRankStore {
  user: User;
  shows: RelativeRankedShow[];
  page: number;
  numberOfPages: number;
  signInFailed: boolean;
  searchResults: RelativeRankedShow[];
  searchWasExecuted: boolean;
  isFetchingShows: boolean;
  isFetchingUserShows: boolean;
  isFetchingSearchResults: boolean;
  attemptingSignUpOrLogin: boolean;
}

export const defaultState: RelativeRankStore = {
  user: null,
  shows: [],
  page: 1,
  numberOfPages: 1,
  signInFailed: false,
  searchResults: [],
  searchWasExecuted: false,
  isFetchingShows: false,
  isFetchingUserShows: false,
  isFetchingSearchResults: false,
  attemptingSignUpOrLogin: false,
};

const store: Store<RelativeRankStore> = createStore(
  MainReducer,
  defaultState,
  composeWithDevTools(applyMiddleware(thunk)),
);

export default store;
