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
  console.log(searchResult);
  return searchResult;
}

export default function UserShowList({
  shows,
  setShowList,
}: showsAndUpdateShows) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<RelativeRankedShow[]>([]);
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
    const newShow: RelativeRankedShow = {
      name: showName,
      rank: 1,
      percentileRank: 1,
    };
    const updatedShows = [newShow, ...shows];
    setShowList(updatedShows);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="user-show-list">
        {(provided) => (
          <main className="max-w-xl m-5 mx-auto" ref={provided.innerRef}>
            <div className="pl-5 pr-5 flex content-center justify-between">
              <label htmlFor="search" className="text-lg m-2">
                Search
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                className="flex-grow border-solid border-4 m-2 p-1 rounded focus:outline-none focus:shadow-outline"
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyPress={() => console.log('hi')}
              />
              <button
                type="button"
                className="m-2 max-w-xs bg-green-800 hover:bg-green-700 text-white text-lg py-2 px-4 rounded flex-grow-0"
                onClick={() =>
                  search(searchTerm).then((res) => setSearchResults(res))
                }
              >
                Search
              </button>
            </div>
            {searchResults.length > 0 &&
              searchResults.map((show: RelativeRankedShow) => (
                <div key={show.name}>
                  <p>{show.name}</p>
                  <button
                    type="button"
                    className="m-2 max-w-xs bg-green-800 hover:bg-green-700 text-white text-lg py-2 px-4 rounded flex-grow-0"
                    onClick={() => addShow(show.name)}
                  >
                    Add Show
                  </button>
                </div>
              ))}
            <div className="pl-5 pr-5 flex content-center justify-between">
              <p className="mt-3 text-lg">
                Drag and drop to reorder your show list.
              </p>
              <button
                type="button"
                className="m-2 max-w-xs bg-green-800 hover:bg-green-700 text-white text-lg py-2 px-4 rounded flex-grow-0"
                onClick={() => dispatch(updateUserShowList(shows))}
              >
                Save Changes
              </button>
            </div>
            {shows.map(({ name, rank, percentileRank }) => (
              <DraggableRankedShow
                key={name}
                name={name}
                rank={rank}
                percentileRank={Math.round(percentileRank * 1000) / 1000}
              />
            ))}
            {provided.placeholder}
          </main>
        )}
      </Droppable>
    </DragDropContext>
  );
}
