import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RelativeRankedShow, RelativeRankStore } from '../redux/store';
import { search, clearSearchResults } from '../redux/action-creators';
import LoadingSpinner from './LoadingSpinner';

const searchDelay = {
  readyToSearch: null,
};

function searchOnType(searchToExecute, sendSearch) {
  const symbol = Symbol(searchToExecute);

  searchDelay.readyToSearch = symbol;
  setTimeout(() => {
    if (searchToExecute && searchDelay.readyToSearch === symbol) {
      sendSearch(searchToExecute);
    }
  }, 1000);
}

type AddShowToTopAndBottomFunctions = {
  addShowToTop: (showName: string) => void;
  addShowToBottom: (showName: string) => void;
};

export default function ShowSearch({
  addShowToTop,
  addShowToBottom,
}: AddShowToTopAndBottomFunctions) {
  const dispatch = useDispatch();
  const store = useSelector<RelativeRankStore, RelativeRankStore>(
    (state) => state,
  );
  const searchResultsLoading = store.isFetchingSearchResults;
  const { searchResults } = store;
  const searchExecuted = store.searchWasExecuted;

  const [searchTerm, setSearchTerm] = useState<string>('');

  function sendSearch(searchParam = null) {
    if (searchParam && searchParam.length > 0) {
      dispatch(search(searchParam));
    } else if (searchTerm.length > 0) {
      dispatch(search(searchTerm));
    }
  }

  function onKeyPress(event) {
    if (event.key === 'Enter') {
      sendSearch();
    }
  }

  function clearSearch() {
    dispatch(clearSearchResults());
    setSearchTerm('');
  }

  return (
    <div className="rounded-lg shadow-md my-2 py-2">
      <h4>Add Show</h4>
      <div className="pl-5 pr-5 flex flex-wrap content-center justify-between">
        <label htmlFor="search" className="text-lg m-2 pt-2">
          Search
        </label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          className="flex-grow border-solid border-4 m-2 p-1 rounded focus:outline-none focus:shadow-outline"
          onChange={(event) => {
            setSearchTerm(event.target.value);
            searchOnType(event.target.value, sendSearch);
          }}
          onKeyPress={onKeyPress}
        />
        <div className="text-center min-w-full sm:min-w-0">
          <button
            type="button"
            className="m-2 max-w-xs bg-green-800 hover:bg-green-700 text-white text-lg py-2 px-4 rounded flex-grow-0"
            onClick={sendSearch}
          >
            Search
          </button>
        </div>
      </div>
      {(searchExecuted || searchResultsLoading) &&
        (searchResultsLoading ? (
          <div className="mb-4">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <button
              type="button"
              className="mx-auto p-1 max-w-xs bg-green-800 hover:bg-green-700 text-white text-xs rounded"
              onClick={clearSearch}
            >
              Clear Search Results
            </button>
            {searchResults.map && searchResults.length < 1 ? (
              <p>No shows matched your search.</p>
            ) : (
              searchResults.map((show: RelativeRankedShow) => (
                <div key={show.name} className="flex justify-between pl-5 pr-5">
                  <p className="pt-2 max-w-xs">{show.name}</p>
                  <div>
                    <button
                      type="button"
                      className="m-2 p-1 max-w-xs bg-green-800 hover:bg-green-700 text-white text-xs rounded"
                      onClick={() => addShowToTop(show.name)}
                    >
                      Add To Top
                    </button>
                    <button
                      type="button"
                      className="m-2 p-1 max-w-xs bg-green-800 hover:bg-green-700 text-white text-xs rounded"
                      onClick={() => addShowToBottom(show.name)}
                    >
                      Add To Bottom
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        ))}
    </div>
  );
}
