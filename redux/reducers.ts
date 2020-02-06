import { RECEIVE_RELATIVE_RANKED_SHOW_LIST } from './action-creators';
import { RelativeRankStore, defaultState } from './store';

export default function MainReducer(
  state = defaultState,
  action,
): RelativeRankStore {
  switch (action.type) {
    case RECEIVE_RELATIVE_RANKED_SHOW_LIST:
      return { ...state, shows: action.shows };
    default:
      return state;
  }
}
