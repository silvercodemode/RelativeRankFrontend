import {
  START_FETCHING_RELATIVE_RANKED_SHOW_LIST,
  RECEIVE_RELATIVE_RANKED_SHOW_LIST,
  SUCCESSFUL_SIGN_UP_OR_LOGIN,
  FAILED_SIGN_UP_OR_LOGIN,
  RESET_SIGN_UP_OR_LOGIN,
  SIGN_OUT,
  START_FETCHING_USER_SHOW_LIST,
  RECEIVE_USER_SHOW_LIST,
  START_SEARCH,
  RECEIVE_SEARCH_RESULT,
  CLEAR_SEARCH_RESULTS,
} from './action-creators';
import { RelativeRankStore, defaultState } from './store';

export default function MainReducer(
  state = defaultState,
  action,
): RelativeRankStore {
  console.log(action.type);
  switch (action.type) {
    case START_FETCHING_RELATIVE_RANKED_SHOW_LIST:
      return { ...state, isFetchingShows: action.isFetchingShows };
    case RECEIVE_RELATIVE_RANKED_SHOW_LIST:
      return {
        ...state,
        shows: action.shows,
        isFetchingShows: action.isFetchingShows,
      };
    case SUCCESSFUL_SIGN_UP_OR_LOGIN:
      return {
        ...state,
        user: {
          username: action.signUpResponse.username,
          token: action.signUpResponse.token,
          showList: null,
        },
      };
    case FAILED_SIGN_UP_OR_LOGIN:
      return {
        ...state,
        signInFailed: true,
      };
    case RESET_SIGN_UP_OR_LOGIN:
      return {
        ...state,
        signInFailed: false,
      };
    case SIGN_OUT:
      return {
        ...state,
        user: null,
      };
    case START_FETCHING_USER_SHOW_LIST:
      return { ...state, isFetchingUserShows: action.isFetchingUserShows };
    case RECEIVE_USER_SHOW_LIST:
      return {
        ...state,
        user: {
          username: state.user.username,
          token: state.user.token,
          showList: action.showList,
        },
        isFetchingUserShows: action.isFetchingUserShows,
      };
    case START_SEARCH:
      return {
        ...state,
        isFetchingSearchResults: action.isFetchingSearchResults,
      };
    case RECEIVE_SEARCH_RESULT:
      return {
        ...state,
        searchResults: action.searchResult,
        isFetchingSearchResults: action.isFetchingSearchResults,
        searchWasExecuted: action.searchWasExecuted,
      };
    case CLEAR_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.searchResult,
        searchWasExecuted: action.searchWasExecuted,
      };
    default:
      return state;
  }
}
