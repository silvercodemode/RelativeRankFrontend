import { useEffect } from 'react';
import { NextPage } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import RankedShowList from '../components/RankedShowList';
import { fetchRelativeRankedShowListIfEmpty } from '../redux/action-creators';
import { RelativeRankStore, RelativeRankedShow } from '../redux/store';

const Home: NextPage<{ userAgent: string }> = () => {
  const shows = useSelector<RelativeRankStore, RelativeRankedShow[]>(
    (state) => state.shows,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRelativeRankedShowListIfEmpty());
  }, []);

  return (
    <>
      <Navbar />
      <RankedShowList shows={shows} />
    </>
  );
};

export default Home;
