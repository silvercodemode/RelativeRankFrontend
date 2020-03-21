/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { RelativeRankedShow as RelativeRankedShowType } from '../redux/store';

export default function DraggableRankedShow({
  name,
  rank,
  percentileRank,
}: RelativeRankedShowType) {
  return (
    <Draggable key={name} draggableId={name} index={rank - 1}>
      {(provided) => (
        <div
          className="flex m-1 p-2 rounded-lg shadow-md even:bg-green-800 even:text-white"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <span className="flex-initial text-4xl">
            {rank}
            <span className="ml-1 text-xs">{percentileRank}</span>
          </span>
          <div className="flex flex-1 justify-end">
            <span className="text-4xl">{name}</span>
          </div>
        </div>
      )}
    </Draggable>
  );
}
