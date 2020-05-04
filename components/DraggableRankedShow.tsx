/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { RelativeRankedShow as RelativeRankedShowType } from '../redux/store';

type ShowWithUpdatorFunction = {
  show: RelativeRankedShowType;
  updator: (name: string) => void;
  moveToTop: (name: string) => void;
  moveToBottom: (name: string) => void;
};

export default function DraggableRankedShow({
  show,
  updator,
  moveToTop,
  moveToBottom,
}: ShowWithUpdatorFunction) {
  const { name, rank, percentileRank } = show;

  return (
    <Draggable key={name} draggableId={name} index={rank - 1}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="rounded-lg shadow-md even:bg-green-800 even:text-white"
        >
          <div className="flex m-1 p-2">
            <span className="flex-initial text-xl">
              {rank}
              <span className="ml-1 text-xs">
                {Math.round(percentileRank * 1000) / 1000}
              </span>
            </span>
            <div className="flex flex-1 justify-end">
              <span className="text-xl">{name}</span>
            </div>
          </div>
          <div className="p-2">
            <button
              type="button"
              className={`p-1 ml-2 rounded-lg shadow-md hover:bg-${
                rank % 2 === 1 ? 'gray-100' : 'green-700'
              }`}
              onClick={() => moveToTop(name)}
            >
              Move to Top
            </button>
            <button
              type="button"
              className={`p-1 ml-2 rounded-lg shadow-md hover:bg-${
                rank % 2 === 1 ? 'gray-100' : 'green-700'
              }`}
              onClick={() => moveToBottom(name)}
            >
              Move to Bottom
            </button>
            <button
              type="button"
              className={`p-1 ml-2 rounded-lg shadow-md hover:bg-${
                rank % 2 === 1 ? 'gray-100' : 'green-700'
              }`}
              onClick={() => updator(name)}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}
