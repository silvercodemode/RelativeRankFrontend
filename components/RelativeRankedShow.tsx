import React from 'react';
import { RelativeRankedShow as RelativeRankedShowType } from '../redux/store';

export default function RelativeRankedShow({
  name,
  rank,
  percentileRank,
}: RelativeRankedShowType) {
  return (
    <div className="flex m-1 p-2 rounded-lg shadow-md even:bg-green-800 even:text-white">
      <span className="flex-initial text-xl mr-4">
        {rank}
        <span className="ml-1 text-xs">{percentileRank}</span>
      </span>
      <div className="flex flex-1 justify-end">
        <span className="text-xl">{name}</span>
      </div>
    </div>
  );
}
