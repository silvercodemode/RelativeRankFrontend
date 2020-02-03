import RelativeRankedShow from '../types/relative-ranked-show';
import { relativeRankedShowsEndpoint } from '../urls';

export const RECEIVE_RELATIVE_RANKED_SHOW_LIST =
  'RECEIVE_RELATIVE_RANKED_SHOW_LIST';

export interface ReceiveRelativeRankedShowListAction {
  type: typeof RECEIVE_RELATIVE_RANKED_SHOW_LIST;
  shows: () => Promise<any>;
}

export function receiveRelativeRankedShowList(
  shows: () => Promise<any>,
): ReceiveRelativeRankedShowListAction {
  return {
    type: RECEIVE_RELATIVE_RANKED_SHOW_LIST,
    shows,
  };
}

export function fetchRelativeRankedShowList() {
  return (dispatch, getState) => {
    return fetch(relativeRankedShowsEndpoint)
      .then((response) => response.json())
      .then((json) => dispatch(receiveRelativeRankedShowList(json)));
  };
}
