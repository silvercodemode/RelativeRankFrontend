import React from 'react';
import RelativeRankedShowType from '../types/RelativeRankedShow';

function RelativeRankedShow({ name, percentileRank }: RelativeRankedShowType) {
  return (
    <div className="">
      <span>{name}</span>
      <span>{percentileRank}</span>
    </div>
  );
}

export default RelativeRankedShow;
