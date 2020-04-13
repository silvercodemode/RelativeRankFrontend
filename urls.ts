const baseUrl = 'https://localhost:44352';

export const relativeRankedShowsEndpoint = baseUrl;
export const signUpEndpoint = `${baseUrl}/user/signup`;
export const loginEndpoint = `${baseUrl}/user/login`;
export const userShowlistUrlMaker = (username) =>
  `${baseUrl}/user/${username}/showlist`;
export const searchUrlMaker = (searchTerm) =>
  `${baseUrl}/show/search?search-term=${searchTerm}`;
