import {
  RECEIVE_RELATIVE_RANKED_SHOW_LIST,
  SUCCESSFUL_SIGN_UP,
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
    case SUCCESSFUL_SIGN_UP:
      return {
        ...state,
        user: {
          username: action.signUpResponse.username,
          token: action.signUpResponse.token,
          showList: null,
        },
      };
    default:
      return state;
  }
}
