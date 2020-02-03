import React from 'react';
import RelativeRankedShowType from '../types/relative-ranked-show';

function RelativeRankedShow({
  name,
  rank,
  percentileRank,
}: RelativeRankedShowType) {
  return (
    <div className="flex m-1 p-1 rounded-lg bg-green-200 odd:bg-gray-500">
      <span className="flex-initial text-4xl">
        {rank}
        <span className="ml-1 text-xs">{percentileRank}</span>
      </span>
      <div className="flex flex-1 justify-end">
        <span className="text-4xl">{name}</span>
      </div>
    </div>
  );
}

export default RelativeRankedShow;
