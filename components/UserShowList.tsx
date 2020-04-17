/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { RelativeRankedShow } from '../redux/store';
import { updateUserShowList } from '../redux/action-creators';
import DraggableRankedShow from './DraggableRankedShow';
import { searchUrlMaker } from '../urls';

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

async function search(searchTerm) {
  const response = await fetch(searchUrlMaker(searchTerm));
  const searchResult: RelativeRankedShow[] = await response.json();
  return searchResult;
}

export default function UserShowList({
  shows,
  setShowList,
}: showsAndUpdateShows) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<RelativeRankedShow[]>([]);
  const [searchExecuted, setSearchExecuted] = useState<boolean>(false);
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

  function addShow(showName) {
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

  function clearSearchResults() {
    setSearchResults([]);
    setSearchExecuted(false);
  }

  function sendSearch() {
    if (searchTerm.length > 0) {
      search(searchTerm).then((res) => {
        setSearchResults(res);
        setSearchExecuted(true);
      });
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
              {searchExecuted && (
                <>
                  <button
                    type="button"
                    className="mx-auto p-1 max-w-xs bg-green-800 hover:bg-green-700 text-white text-xs rounded"
                    onClick={clearSearchResults}
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
                        <p className="pt-2">{show.name}</p>
                        <button
                          type="button"
                          className="m-2 p-1 max-w-xs bg-green-800 hover:bg-green-700 text-white text-xs rounded"
                          onClick={() => addShow(show.name)}
                        >
                          Add
                        </button>
                      </div>
                    ))
                  )}
                </>
              )}
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
            {shows.map((show) => (
              <DraggableRankedShow
                key={show.name}
                show={show}
                updator={deleteShow}
              />
            ))}
            {provided.placeholder}
          </main>
        )}
      </Droppable>
    </DragDropContext>
  );
}
