import { relativeRankedShowsEndpoint, signUpEndpoint } from '../urls';
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

export const SUCCESSFUL_SIGN_UP = 'SUCCESSFUL_SIGN_UP';

export const successfulSignUp = (signUpResponse: SignUpResponse) => ({
  type: SUCCESSFUL_SIGN_UP,
  signUpResponse,
});

export const sendSignUpRequest = (signUpParams: SignUpParams) => async (
  dispatch,
) => {
  const response = await fetch(signUpEndpoint, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signUpParams),
  });
  const signUpResponse: SignUpResponse = await response.json();
  dispatch(successfulSignUp(signUpResponse));
};

export const signUp = (signUpParams: SignUpParams) => (dispatch) => {
  dispatch(sendSignUpRequest(signUpParams));
};

export interface SignUpParams {
  username: string;
  password: string;
}

export interface SignUpResponse {
  id: number;
  username: string;
  password: string;
  token: string;
}
