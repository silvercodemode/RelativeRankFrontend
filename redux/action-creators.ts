import { relativeRankedShowsEndpoint } from '../urls';
import { RelativeRankStore, RelativeRankedShow } from './store';

export const RECEIVE_RELATIVE_RANKED_SHOW_LIST =
  'RECEIVE_RELATIVE_RANKED_SHOW_LIST';

export interface ReceiveRelativeRankedShowListAction {
  type: typeof RECEIVE_RELATIVE_RANKED_SHOW_LIST;
  shows: RelativeRankedShow[];
}

export const receiveRelativeRankedShowList = (
  shows: RelativeRankedShow[],
): ReceiveRelativeRankedShowListAction => ({
  type: RECEIVE_RELATIVE_RANKED_SHOW_LIST,
  shows,
});

export const fetchRelativeRankedShowList = () => async (dispatch) => {
  const response = await fetch(relativeRankedShowsEndpoint);
  const showList: RelativeRankedShow[] = await response.json();
  dispatch(receiveRelativeRankedShowList(showList));
};

export const fetchRelativeRankedShowListIfEmpty = () => (
  dispatch,
  getState: () => RelativeRankStore,
) => {
  if (getState().shows.length < 1) {
    dispatch(fetchRelativeRankedShowList());
  }
};
