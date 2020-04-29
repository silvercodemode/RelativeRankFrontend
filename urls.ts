const baseUrl = 'https://localhost:44352'; // 'https://relative-rank-api.azurewebsites.net';

export const relativeRankedShowsEndpoint = `${baseUrl}/index`;
export const signUpEndpoint = `${baseUrl}/user/signup`;
export const loginEndpoint = `${baseUrl}/user/login`;
export const userShowlistUrlMaker = (username) =>
  `${baseUrl}/user/${username}/showlist`;
export const searchUrlMaker = (searchTerm) =>
  `${baseUrl}/show/search?search-term=${searchTerm}`;
