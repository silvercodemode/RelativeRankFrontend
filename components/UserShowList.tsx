import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { RelativeRankedShow, RelativeRankStore } from '../redux/store';
import {
  updateUserShowList,
  startImportFromMal,
  receiveImportFromMal,
} from '../redux/action-creators';
import DraggableRankedShow from './DraggableRankedShow';
import LoadingSpinner from './LoadingSpinner';
import ShowSearch from './ShowSearch';
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

export default function UserShowList({
  shows,
  setShowList,
}: showsAndUpdateShows) {
  const store = useSelector<RelativeRankStore, RelativeRankStore>(
    (state) => state,
  );
  const userShowsLoading = store.isFetchingUserShows;

  const [username, setUsername] = useState('');
  const [listHasUnsavedChanges, setListHasUnsavedChanges] = useState<boolean>(
    false,
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [moveToRankPromptIsOpen, setMoveToRankPromptOpen] = useState<boolean>(
    false,
  );
  const [moveToRankShow, setMoveToRankShow] = useState<string>('');
  const [moveToRankRank, setMoveToRankRank] = useState<number>(1);

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

  function openMoveToRankPrompt(showName: string) {
    setMoveToRankPromptOpen(true);
    setMoveToRankShow(showName);
  }

  function cancelMoveToRank() {
    setMoveToRankPromptOpen(false);
    setMoveToRankShow('');
  }

  function moveToRank() {
    const show = shows.find((s) => s.name === moveToRankShow);
    const otherShows = shows.filter((s) => s.name !== moveToRankShow);
    let updatedShows = otherShows
      ? [
          ...otherShows.slice(0, moveToRankRank - 1),
          show,
          ...otherShows.slice(moveToRankRank - 1),
        ]
      : [show];
    updatedShows = updatedShows.map((s, i) => ({
      name: s.name,
      rank: i + 1,
      percentileRank: 1 - (1 / (shows.length + 1)) * (i + 1),
    }));
    setShowList(updatedShows);
    setListHasUnsavedChanges(true);
    cancelMoveToRank();

    const y = window.scrollY;
    setTimeout(() => {
      window.scrollTo(0, y);
    }, 0);
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
            {moveToRankPromptIsOpen && (
              <div className="fixed w-screen top-2/5">
                <div className="w-3/5 mx-auto bg-white shadow-md p-3 rounded-lg flex flex-col content-center justify-center items-center">
                  <h2 className="text-center mb-1 text-xl">
                    Move: {moveToRankShow}
                  </h2>
                  <div className="flex-auto flex justify-between">
                    <label htmlFor="username" className="text-lg m-2">
                      Rank to Move to:
                    </label>
                    <input
                      id="rank-to-move-to"
                      type="number"
                      min={1}
                      max={shows.length}
                      value={moveToRankRank}
                      className="flex-grow border-solid border-4 m-2 p-1 rounded focus:outline-none focus:shadow-outline"
                      onChange={(event) =>
                        setMoveToRankRank(parseInt(event.target.value, 10))
                      }
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      className="m-2 max-w-xs bg-green-800 hover:bg-green-700 text-white text-lg py-2 px-4 rounded flex-grow-0"
                      onClick={() => cancelMoveToRank()}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="m-2 max-w-xs bg-green-800 hover:bg-green-700 text-white text-lg py-2 px-4 rounded flex-grow-0"
                      onClick={() => moveToRank()}
                    >
                      Move
                    </button>
                  </div>
                </div>
              </div>
            )}
            <main
              className="max-w-xl mx-5 mt-5 mb-20 mx-auto text-center"
              ref={provided.innerRef}
            >
              <ShowSearch
                addShowToBottom={addShowToBottom}
                addShowToTop={addShowToTop}
              />
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
                      openMoveToRankPrompt={openMoveToRankPrompt}
                    />
                  ))}
                </div>
              )}
              {provided.placeholder}
            </main>
            {!isDragging &&
              !userShowsLoading &&
              (listHasUnsavedChanges || shows.length > 10) && (
                <footer className="fixed content-center justify-center bottom-0 w-screen bg-white flex text-center">
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
                </footer>
              )}
          </>
        )}
      </Droppable>
    </DragDropContext>
  );
}
