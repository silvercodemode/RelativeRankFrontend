import { debounce } from 'lodash';
import {
  relativeRankedShowsEndpoint,
  signUpEndpoint,
  loginEndpoint,
  userShowlistUrlMaker,
  searchUrlMaker,
} from '../urls';
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

export const SUCCESSFUL_SIGN_UP_OR_LOGIN = 'SUCCESSFUL_SIGN_UP_OR_LOGIN';

export const successfulSignUpOrLogin = (signUpResponse: SignUpResponse) => ({
  type: SUCCESSFUL_SIGN_UP_OR_LOGIN,
  signUpResponse,
});

export const FAILED_SIGN_UP_OR_LOGIN = 'FAILED_SIGN_UP_OR_LOGIN';

export const failedSignUpOrLogin = (error) => ({
  type: FAILED_SIGN_UP_OR_LOGIN,
  error,
});

export const RESET_SIGN_UP_OR_LOGIN = 'RESET_SIGN_UP_OR_LOGIN';

export const resetSignUpOrLogin = () => ({
  type: RESET_SIGN_UP_OR_LOGIN,
});

export const sendSignUpRequest = (signUpParams: SignUpParams) => async (
  dispatch,
) => {
  try {
    const response = await fetch(signUpEndpoint, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signUpParams),
    });
    const signUpResponse: SignUpResponse = await response.json();
    dispatch(successfulSignUpOrLogin(signUpResponse));
    localStorage.setItem('username', signUpResponse.username);
    localStorage.setItem('token', signUpResponse.token);
  } catch (error) {
    dispatch(failedSignUpOrLogin(error));
  }
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

export const sendLoginRequest = (loginParams: SignUpParams) => async (
  dispatch,
) => {
  try {
    const response = await fetch(loginEndpoint, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginParams),
    });
    const signUpResponse: SignUpResponse = await response.json();
    dispatch(successfulSignUpOrLogin(signUpResponse));
    localStorage.setItem('username', signUpResponse.username);
    localStorage.setItem('token', signUpResponse.token);
  } catch (error) {
    dispatch(failedSignUpOrLogin(error));
  }
};

export const login = (loginParams: SignUpParams) => (dispatch) => {
  dispatch(sendLoginRequest(loginParams));
};

export const SIGN_OUT = 'SIGN_OUT';

export const signOut = () => {
  localStorage.clear();
  return {
    type: SIGN_OUT,
  };
};

export const RECEIVE_USER_SHOW_LIST = 'RECEIVE_USER_SHOW_LIST';

export interface ReceiveShowListAction {
  type: typeof RECEIVE_USER_SHOW_LIST;
  showList: RelativeRankedShow[];
}

export const receiveShowList = (
  showList: RelativeRankedShow[],
): ReceiveShowListAction => ({
  type: RECEIVE_USER_SHOW_LIST,
  showList,
});

export const fetchUserShowList = () => async (
  dispatch,
  getState: () => RelativeRankStore,
) => {
  const response = await fetch(userShowlistUrlMaker(getState().user.username));
  const showList: RelativeRankedShow[] = await response.json();
  dispatch(receiveShowList(showList));
};

export const updateUserShowList = (showList: RelativeRankedShow[]) => async (
  dispatch,
  getState: () => RelativeRankStore,
) => {
  const { username, token } = getState().user;

  const response = await fetch(userShowlistUrlMaker(username), {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      Username: username,
      ShowList: showList,
    }),
  });

  const updatedShowList: RelativeRankedShow[] = await response.json();
  dispatch(receiveShowList(updatedShowList));
};

export const RECEIVE_SEARCH_RESULT = 'RECEIVE_SEARCH_RESULT';

export interface ReceiveSearchResultAction {
  type: typeof RECEIVE_SEARCH_RESULT;
  searchResult: RelativeRankedShow[];
}

export const receiveSearchResult = (
  searchResult: RelativeRankedShow[],
): ReceiveSearchResultAction => ({
  type: RECEIVE_SEARCH_RESULT,
  searchResult,
});

export const search = (searchTerm: string) => async (dispatch) => {
  const response = await fetch(searchUrlMaker(searchTerm));
  const searchResult: RelativeRankedShow[] = await response.json();
  console.log(searchResult);
  dispatch(receiveSearchResult(searchResult));
};

export const debouncedSearch = debounce(search, 1000);
