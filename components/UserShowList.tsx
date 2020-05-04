/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { throttle } from 'lodash';
import { RelativeRankedShow, RelativeRankStore } from '../redux/store';
import {
  updateUserShowList,
  search,
  clearSearchResults,
  startImportFromMal,
  receiveImportFromMal,
} from '../redux/action-creators';
import DraggableRankedShow from './DraggableRankedShow';
import LoadingSpinner from './LoadingSpinner';
import { importFromMalEndpoint } from '../urls';

type dropppableLocation = {
  droppableId: string;
  index: number;
};

type dragResult = {
  draggableId: string;
  source: dropppableLocation;
  destination: dropppableLocation;
};

type showsAndUpdateShows = {
  shows: RelativeRankedShow[];
  setShowList: (shows: RelativeRankedShow[]) => void;
};

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

export default function UserShowList({
  shows,
  setShowList,
}: showsAndUpdateShows) {
  const store = useSelector<RelativeRankStore, RelativeRankStore>(
    (state) => state,
  );
  const userShowsLoading = store.isFetchingUserShows;
  const searchResultsLoading = store.isFetchingSearchResults;
  const { searchResults } = store;
  const searchExecuted = store.searchWasExecuted;

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [username, setUsername] = useState('');
  const [listHasUnsavedChanges, setListHasUnsavedChanges] = useState<boolean>(
    false,
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dispatch = useDispatch();

  function onDragStart() {
    setIsDragging(true);
  }

  function onDragEnd({ source, destination }: dragResult) {
    setIsDragging(false);
    if (destination && destination.droppableId === 'user-show-list') {
      const updatedShows = [...shows];

      if (source.index < destination.index) {
        const sourceName = updatedShows[source.index].name;
        for (let i = source.index; i < destination.index; i += 1) {
          updatedShows[i].name = updatedShows[i + 1].name;
        }
        updatedShows[destination.index].name = sourceName;
      } else if (source.index > destination.index) {
        const sourceName = updatedShows[source.index].name;
        for (let i = source.index; i > destination.index; i -= 1) {
          updatedShows[i].name = updatedShows[i - 1].name;
        }
        updatedShows[destination.index].name = sourceName;
      }

      setShowList(updatedShows);
      setListHasUnsavedChanges(true);
    }
  }

  function moveToTop(showName: string) {
    const show = shows.find((s) => s.name === showName);
    const otherShows = shows.filter((s) => s.name !== showName);
    let updatedShows = otherShows ? [show, ...otherShows] : [show];
    updatedShows = updatedShows.map((s, i) => ({
      name: s.name,
      rank: i + 1,
      percentileRank: 1 - (1 / (shows.length + 1)) * (i + 1),
    }));
    setShowList(updatedShows);
    setListHasUnsavedChanges(true);

    const y = window.scrollY;
    setTimeout(() => {
      window.scrollTo(0, y);
    }, 0);
  }

  function moveToBottom(showName: string) {
    const show = shows.find((s) => s.name === showName);
    const otherShows = shows.filter((s) => s.name !== showName);
    let updatedShows = otherShows ? [...otherShows, show] : [show];
    updatedShows = updatedShows.map((s, i) => ({
      name: s.name,
      rank: i + 1,
      percentileRank: 1 - (1 / (shows.length + 1)) * (i + 1),
    }));
    setShowList(updatedShows);
    setListHasUnsavedChanges(true);
  }

  function addShowToTop(showName) {
    if (shows.some((show) => show.name === showName)) {
      return;
    }
    const newShow: RelativeRankedShow = {
      name: showName,
      rank: 0,
      percentileRank: 0,
    };
    const updatedShows = [newShow, ...shows].map((show, i) => ({
      name: show.name,
      rank: i + 1,
      percentileRank: 1 - (1 / (shows.length + 2)) * (i + 1),
    }));
    setShowList(updatedShows);
    setListHasUnsavedChanges(true);
  }

  function addShowToBottom(showName) {
    if (shows.some((show) => show.name === showName)) {
      return;
    }
    const newShow: RelativeRankedShow = {
      name: showName,
      rank: 0,
      percentileRank: 0,
    };
    const updatedShows = [...shows, newShow].map((show, i) => ({
      name: show.name,
      rank: i + 1,
      percentileRank: 1 - (1 / (shows.length + 2)) * (i + 1),
    }));
    setShowList(updatedShows);
    setListHasUnsavedChanges(true);
  }

  function deleteShow(showName) {
    if (!shows.some((show) => show.name === showName)) {
      return;
    }

    const updatedShows = shows
      .filter((show) => show.name !== showName)
      .map((show, i) => ({
        name: show.name,
        rank: i + 1,
        percentileRank: 1 - (1 / shows.length) * (i + 1),
      }));
    setShowList(updatedShows);
    setListHasUnsavedChanges(true);
  }

  function clearSearch() {
    dispatch(clearSearchResults());
  }

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

  async function importFromMal() {
    dispatch(startImportFromMal());
    let showList: RelativeRankedShow[] = null;
    try {
      const response = await fetch(
        `${importFromMalEndpoint}?username=${username}`,
      );
      showList = await response.json();
    } finally {
      setShowList(showList);
      setListHasUnsavedChanges(true);
      dispatch(receiveImportFromMal());
    }
  }

  function onKeyPressImportFromMal(event) {
    if (event.key === 'Enter') {
      importFromMal();
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <Droppable droppableId="user-show-list">
        {(provided) => (
          <>
            {!isDragging &&
              !userShowsLoading &&
              (listHasUnsavedChanges || shows.length > 10) && (
                <div className="fixed content-center justify-center bottom-0 w-screen bg-white flex text-center">
                  {shows.length > 10 && (
                    <button
                      type="button"
                      className="m-4 p-2 rounded-lg shadow-md hover:bg-gray-100"
                      onClick={() => {
                        window.scrollTo({
                          top: 0,
                        });
                      }}
                    >
                      Go to Top
                    </button>
                  )}
                  {shows.length > 10 && (
                    <button
                      type="button"
                      className="m-4 p-2 rounded-lg shadow-md hover:bg-gray-100"
                      onClick={() => {
                        window.scrollTo({
                          top: document.body.scrollHeight,
                        });
                      }}
                    >
                      Go To Bottom
                    </button>
                  )}
                  {listHasUnsavedChanges && (
                    <button
                      type="button"
                      className="m-4 bg-red-700 hover:bg-red-600 text-white text-lg py-2 px-4 rounded"
                      onClick={() => {
                        dispatch(updateUserShowList(shows));
                        setListHasUnsavedChanges(false);
                      }}
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              )}
            <main
              className="max-w-xl mx-5 mt-5 mb-20 mx-auto text-center"
              ref={provided.innerRef}
            >
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
                          <div
                            key={show.name}
                            className="flex justify-between pl-5 pr-5"
                          >
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
              <div className="pl-5 pr-5 flex content-center justify-center text-center">
                <p className="m-3 text-lg">Drag and drop to reorder list.</p>
              </div>
              {userShowsLoading ? (
                <div className="mt-20">
                  <LoadingSpinner />
                </div>
              ) : shows.length < 1 ? (
                <>
                  <p className="m-3">No shows yet.</p>
                  <div className="m-5 shadow-md p-3 rounded-lg flex flex-col justify-center items-center">
                    <h2 className="text-center mb-1 text-xl">
                      Import from MyAnimeList?
                    </h2>
                    <p className="text-center text-xs">
                      (MAL account must be public)
                    </p>
                    <div className="flex-auto flex justify-between">
                      <label htmlFor="username" className="text-lg m-2">
                        MAL Username
                      </label>
                      <input
                        id="username"
                        type="text"
                        value={username}
                        className="flex-grow border-solid border-4 m-2 p-1 rounded focus:outline-none focus:shadow-outline"
                        onChange={(event) => setUsername(event.target.value)}
                        onKeyPress={onKeyPressImportFromMal}
                      />
                    </div>

                    <button
                      type="button"
                      className="m-2 max-w-xs bg-green-800 hover:bg-green-700 text-white text-lg py-2 px-4 rounded flex-grow-0"
                      onClick={() => importFromMal()}
                    >
                      Import
                    </button>
                  </div>
                </>
              ) : (
                <div
                  className={
                    listHasUnsavedChanges
                      ? 'm-1 p-1 border rounded border-red-700'
                      : ''
                  }
                >
                  {shows.map((show) => (
                    <DraggableRankedShow
                      key={show.name}
                      show={show}
                      updator={deleteShow}
                      moveToTop={moveToTop}
                      moveToBottom={moveToBottom}
                    />
                  ))}
                </div>
              )}
              {provided.placeholder}
            </main>
          </>
        )}
      </Droppable>
    </DragDropContext>
  );
}
