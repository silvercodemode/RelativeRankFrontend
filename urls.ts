const baseUrl = 'http://localhost:8080';

export const relativeRankedShowsEndpoint = `${baseUrl}/global-ranked-show-list`;
export const signUpEndpoint = `${baseUrl}/users`;
export const loginEndpoint = `${baseUrl}/login`;
export const userShowlistUrlMaker = (username) =>
  `${baseUrl}/show-lists/${username}`;
export const searchUrlMaker = (searchTerm) =>
  `${baseUrl}/shows/?show-name=${searchTerm}`;
export const importFromMalEndpoint = `${baseUrl}/import-from-mal`;
