import React from 'react';
import RelativeRankedShow from '../types/RelativeRankedShow';
import RelativeRankedShowComponent from './RelativeRankedShow';

type hasArrayOfRelativeRankedShows = {
  shows: RelativeRankedShow[];
};

function RankedShowList({ shows }: hasArrayOfRelativeRankedShows) {
  return (
    <div className="max-w-sm mx-auto shadow-lg">
      {shows.map(({ name, percentileRank }) => (
        <RelativeRankedShowComponent
          name={name}
          percentileRank={percentileRank}
        />
      ))}
    </div>
  );
}

export default RankedShowList;
