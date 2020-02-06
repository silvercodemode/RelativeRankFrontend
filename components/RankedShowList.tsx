import React from 'react';
import { RelativeRankedShow } from '../redux/store';
import RelativeRankedShowComponent from './RelativeRankedShow';

type hasArrayOfRelativeRankedShows = {
  shows: RelativeRankedShow[];
};

function RankedShowList({ shows }: hasArrayOfRelativeRankedShows) {
  return (
    <div className="max-w-xl m-5 mx-auto shadow-lg odd:bg-red-900">
      {shows.map(({ name, rank, percentileRank }) => (
        <RelativeRankedShowComponent
          key={name}
          name={name}
          rank={rank}
          percentileRank={Math.round(percentileRank * 1000) / 1000}
        />
      ))}
    </div>
  );
}

export default RankedShowList;
