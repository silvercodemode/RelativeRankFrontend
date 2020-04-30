import React from 'react';
import { RelativeRankedShow } from '../redux/store';
import RelativeRankedShowComponent from './RelativeRankedShow';

type hasArrayOfRelativeRankedShows = {
  shows: RelativeRankedShow[];
};

export default function RankedShowList({
  shows,
}: hasArrayOfRelativeRankedShows) {
  return (
    <main className="max-w-xl m-2 mx-auto">
      <>
        <div className="flex m-3 p-2">
          <span className="flex-initial text-2xl">
            Rank
            <span className="ml-1 text-xs">rating</span>
          </span>
          <div className="flex flex-1 justify-end">
            <span className="text-2xl">Anime Title</span>
          </div>
        </div>

        {shows.map(({ name, rank, percentileRank }) => (
          <RelativeRankedShowComponent
            key={name}
            name={name}
            rank={rank}
            percentileRank={Math.round(percentileRank * 1000) / 1000}
          />
        ))}
      </>
    </main>
  );
}
