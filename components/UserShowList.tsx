/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { RelativeRankedShow } from '../redux/store';
import DraggableRankedShow from './DraggableRankedShow';

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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="user-show-list">
        {(provided) => (
          <main className="max-w-xl m-5 mx-auto" ref={provided.innerRef}>
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
