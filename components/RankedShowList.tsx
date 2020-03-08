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
    <main className="max-w-xl m-5 mx-auto">
      {shows.map(({ name, rank, percentileRank }) => (
        <RelativeRankedShowComponent
          key={name}
          name={name}
          rank={rank}
          percentileRank={Math.round(percentileRank * 1000) / 1000}
        />
      ))}
    </main>
  );
}
