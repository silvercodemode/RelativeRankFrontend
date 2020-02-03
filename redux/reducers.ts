import { RECEIVE_RELATIVE_RANKED_SHOW_LIST } from './action-creators';

export default function App(state = { shows: [] }, action) {
  switch (action.type) {
    case RECEIVE_RELATIVE_RANKED_SHOW_LIST:
      console.log(action);
      return { ...state, shows: action.shows };
    default:
      return state;
  }
}
