import { debounce } from 'lodash';
import {
  relativeRankedShowsEndpoint,
  signUpEndpoint,
  loginEndpoint,
  userShowlistUrlMaker,
  searchUrlMaker,
} from '../urls';
import { RelativeRankStore, RelativeRankedShow, PagedShowList } from './store';

export const START_FETCHING_RELATIVE_RANKED_SHOW_LIST =
  'START_FETCHING_RELATIVE_RANKED_SHOW_LIST';

export interface StartFetchingRelativeRankedShowListAction {
  type: typeof START_FETCHING_RELATIVE_RANKED_SHOW_LIST;
  isFetchingShows: boolean;
}

export const startFetchingRelativeRankedShowList = (): StartFetchingRelativeRankedShowListAction => ({
  type: START_FETCHING_RELATIVE_RANKED_SHOW_LIST,
  isFetchingShows: true,
});

export const RECEIVE_RELATIVE_RANKED_SHOW_LIST =
  'RECEIVE_RELATIVE_RANKED_SHOW_LIST';

export interface ReceiveRelativeRankedShowListAction {
  type: typeof RECEIVE_RELATIVE_RANKED_SHOW_LIST;
  shows: PagedShowList;
  page: number;
  isFetchingShows: boolean;
}

export const receiveRelativeRankedShowList = (
  shows: PagedShowList,
  page: number,
): ReceiveRelativeRankedShowListAction => ({
  type: RECEIVE_RELATIVE_RANKED_SHOW_LIST,
  shows,
  page,
  isFetchingShows: false,
});

export const fetchRelativeRankedShowList = (page: number) => async (
  dispatch,
) => {
  dispatch(startFetchingRelativeRankedShowList());
  let showList: PagedShowList = null;
  try {
    const response = await fetch(`${relativeRankedShowsEndpoint}?page=${page}`);
    showList = await response.json();
  } finally {
    dispatch(receiveRelativeRankedShowList(showList, page));
  }
};

export const fetchRelativeRankedShowListIfEmpty = () => (
  dispatch,
  getState: () => RelativeRankStore,
) => {
  if (getState().shows.length < 1) {
    dispatch(fetchRelativeRankedShowList(1));
  }
};

export const START_SIGN_UP_OR_LOGIN = 'ATTEMPT_SIGN_UP_OR_LOGIN';

interface StartSignUpOrLoginAction {
  type: typeof START_SIGN_UP_OR_LOGIN;
  attemptingSignUpOrLogin: boolean;
}

export const startSignUpOrLogin = (): StartSignUpOrLoginAction => ({
  type: START_SIGN_UP_OR_LOGIN,
  attemptingSignUpOrLogin: true,
});

export const SUCCESSFUL_SIGN_UP_OR_LOGIN = 'SUCCESSFUL_SIGN_UP_OR_LOGIN';

interface SuccessfulSignUpOrLoginAction {
  type: typeof SUCCESSFUL_SIGN_UP_OR_LOGIN;
  signUpResponse: SignUpResponse;
  attemptingSignUpOrLogin: boolean;
}

export const successfulSignUpOrLogin = (
  signUpResponse: SignUpResponse,
): SuccessfulSignUpOrLoginAction => ({
  type: SUCCESSFUL_SIGN_UP_OR_LOGIN,
  signUpResponse,
  attemptingSignUpOrLogin: false,
});

export const FAILED_SIGN_UP_OR_LOGIN = 'FAILED_SIGN_UP_OR_LOGIN';

interface FailedSignUpOrLoginAction {
  type: typeof FAILED_SIGN_UP_OR_LOGIN;
  error;
  attemptingSignUpOrLogin: boolean;
}

export const failedSignUpOrLogin = (error): FailedSignUpOrLoginAction => ({
  type: FAILED_SIGN_UP_OR_LOGIN,
  error,
  attemptingSignUpOrLogin: false,
});

export const RESET_SIGN_UP_OR_LOGIN = 'RESET_SIGN_UP_OR_LOGIN';

export const resetSignUpOrLogin = () => ({
  type: RESET_SIGN_UP_OR_LOGIN,
});

export const sendSignUpRequest = (signUpParams: SignUpParams) => async (
  dispatch,
) => {
  try {
    dispatch(startSignUpOrLogin());

    const response = await fetch(signUpEndpoint, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signUpParams),
    });

    const signUpResponse: SignUpResponse = await response.json();

    if (response.ok) {
      dispatch(successfulSignUpOrLogin(signUpResponse));

      localStorage.setItem('username', signUpResponse.username);
      localStorage.setItem('token', signUpResponse.token);
    } else {
      dispatch(failedSignUpOrLogin(response.statusText));
    }
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
    dispatch(startSignUpOrLogin());

    const response = await fetch(loginEndpoint, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginParams),
    });

    const signUpResponse: SignUpResponse = await response.json();

    if (response.ok) {
      dispatch(successfulSignUpOrLogin(signUpResponse));

      localStorage.setItem('username', signUpResponse.username);
      localStorage.setItem('token', signUpResponse.token);
    } else {
      dispatch(failedSignUpOrLogin(response.statusText));
    }
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

export const START_FETCHING_USER_SHOW_LIST = 'START_FETCHING_USER_SHOW_LIST';

export interface StartFetchingUserShowListAction {
  type: typeof START_FETCHING_USER_SHOW_LIST;
  isFetchingUserShows: boolean;
}

export const startFetchingUserShowList = (): StartFetchingUserShowListAction => ({
  type: START_FETCHING_USER_SHOW_LIST,
  isFetchingUserShows: true,
});

export const RECEIVE_USER_SHOW_LIST = 'RECEIVE_USER_SHOW_LIST';

export interface ReceiveShowListAction {
  type: typeof RECEIVE_USER_SHOW_LIST;
  showList: RelativeRankedShow[];
  isFetchingUserShows: boolean;
}

export const receiveShowList = (
  showList: RelativeRankedShow[],
): ReceiveShowListAction => ({
  type: RECEIVE_USER_SHOW_LIST,
  showList,
  isFetchingUserShows: false,
});

export const fetchUserShowList = () => async (
  dispatch,
  getState: () => RelativeRankStore,
) => {
  dispatch(startFetchingUserShowList());
  let showList: RelativeRankedShow[] = null;
  try {
    const response = await fetch(
      userShowlistUrlMaker(getState().user.username),
    );
    showList = await response.json();
  } finally {
    dispatch(receiveShowList(showList));
  }
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

export const START_SEARCH = 'START_SEARCH';

export interface StartSearch {
  type: typeof START_SEARCH;
  isFetchingSearchResults: boolean;
}

export const startSearch = (): StartSearch => ({
  type: START_SEARCH,
  isFetchingSearchResults: true,
});

export const RECEIVE_SEARCH_RESULT = 'RECEIVE_SEARCH_RESULT';

export interface ReceiveSearchResultAction {
  type: typeof RECEIVE_SEARCH_RESULT;
  searchResult: RelativeRankedShow[];
  isFetchingSearchResults: boolean;
  searchWasExecuted: boolean;
}

export const receiveSearchResult = (
  searchResult: RelativeRankedShow[],
): ReceiveSearchResultAction => ({
  type: RECEIVE_SEARCH_RESULT,
  searchResult,
  isFetchingSearchResults: false,
  searchWasExecuted: true,
});

export const search = (searchTerm: string) => async (dispatch) => {
  let searchResult: RelativeRankedShow[] = null;
  dispatch(startSearch());
  try {
    const response = await fetch(searchUrlMaker(searchTerm));
    searchResult = await response.json();
  } finally {
    dispatch(receiveSearchResult(searchResult));
  }
};

export const debouncedSearch = debounce(search, 1000);

export const CLEAR_SEARCH_RESULTS = 'CLEAR_SEARCH_RESULTS';

export interface ClearSearchResults {
  type: typeof CLEAR_SEARCH_RESULTS;
  searchResult: RelativeRankedShow[];
  searchWasExecuted: boolean;
}

export const clearSearchResults = (): ClearSearchResults => ({
  type: CLEAR_SEARCH_RESULTS,
  searchResult: [],
  searchWasExecuted: false,
});
