/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { RelativeRankedShow, RelativeRankStore } from '../redux/store';
import {
  updateUserShowList,
  search,
  clearSearchResults,
} from '../redux/action-creators';
import DraggableRankedShow from './DraggableRankedShow';
import LoadingSpinner from './LoadingSpinner';

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

export default function UserShowList({
  shows,
  setShowList,
}: showsAndUpdateShows) {
  const userShowsLoading = useSelector<RelativeRankStore, boolean>(
    (state) => state.isFetchingUserShows,
  );
  const searchResultsLoading = useSelector<RelativeRankStore, boolean>(
    (state) => state.isFetchingSearchResults,
  );
  const searchResults = useSelector<RelativeRankStore, RelativeRankedShow[]>(
    (state) => state.searchResults,
  );
  const searchExecuted = useSelector<RelativeRankStore, boolean>(
    (state) => state.searchWasExecuted,
  );

  const [searchTerm, setSearchTerm] = useState<string>('');
  const dispatch = useDispatch();

  function onDragEnd({ source, destination }: dragResult) {
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
    }
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
  }

  function clearSearch() {
    dispatch(clearSearchResults());
  }

  function sendSearch() {
    if (searchTerm.length > 0) {
      dispatch(search(searchTerm));
    }
  }

  function onKeyPress(event) {
    if (event.key === 'Enter') {
      sendSearch();
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="user-show-list">
        {(provided) => (
          <main
            className="max-w-xl m-5 mx-auto text-center"
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
                  onChange={(event) => setSearchTerm(event.target.value)}
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
            <div className="pl-5 pr-5 flex content-center justify-between">
              <p className="mt-3 text-lg text-left">
                Drag and drop to reorder list.
              </p>
              <button
                type="button"
                className="m-2 max-w-xs bg-green-800 hover:bg-green-700 text-white text-lg py-2 px-4 rounded flex-grow-0"
                onClick={() => dispatch(updateUserShowList(shows))}
              >
                Save
              </button>
            </div>
            {userShowsLoading ? (
              <div className="mt-20">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <div className="max-w-xl mb-5 mx-auto text-center">
                  <button
                    type="button"
                    className="p-2 rounded-lg shadow-md"
                    onClick={() => {
                      window.scrollTo({
                        top: document.body.scrollHeight,
                      });
                    }}
                  >
                    Go To Bottom
                  </button>
                </div>
                {shows.map((show) => (
                  <DraggableRankedShow
                    key={show.name}
                    show={show}
                    updator={deleteShow}
                  />
                ))}
                <footer className="max-w-xl m-5 mx-auto text-center">
                  <button
                    type="button"
                    className="m-4 p-2 rounded-lg shadow-md"
                    onClick={() => {
                      window.scrollTo({
                        top: 0,
                      });
                    }}
                  >
                    Back to Top
                  </button>
                </footer>
              </>
            )}
            {provided.placeholder}
          </main>
        )}
      </Droppable>
    </DragDropContext>
  );
}
