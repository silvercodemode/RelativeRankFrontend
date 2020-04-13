import {
  RECEIVE_RELATIVE_RANKED_SHOW_LIST,
  SUCCESSFUL_SIGN_UP_OR_LOGIN,
  FAILED_SIGN_UP_OR_LOGIN,
  RESET_SIGN_UP_OR_LOGIN,
  SIGN_OUT,
  RECEIVE_USER_SHOW_LIST,
  RECEIVE_SEARCH_RESULT,
} from './action-creators';
import { RelativeRankStore, defaultState } from './store';

export default function MainReducer(
  state = defaultState,
  action,
): RelativeRankStore {
  console.log(action);
  switch (action.type) {
    case RECEIVE_RELATIVE_RANKED_SHOW_LIST:
      return { ...state, shows: action.shows };
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
    case RECEIVE_USER_SHOW_LIST:
      return {
        ...state,
        user: {
          username: state.user.username,
          token: state.user.token,
          showList: action.showList,
        },
      };
    case RECEIVE_SEARCH_RESULT:
      return {
        ...state,
        searchResult: action.searchResult,
      };
    default:
      return state;
  }
}
