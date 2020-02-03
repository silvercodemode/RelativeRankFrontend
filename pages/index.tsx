import { useEffect } from 'react';
import { NextPage } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import RankedShowList from '../components/RankedShowList';
import { fetchRelativeRankedShowList } from '../redux/action-creators';
import { RelativeRankedStore } from '../redux/store';
import RelativeRankedShow from '../types/relative-ranked-show';

const Home: NextPage<{ userAgent: string }> = () => {
  const shows = useSelector<RelativeRankedStore, RelativeRankedShow[]>(
    (state) => state.shows,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRelativeRankedShowList());
  }, []);

  return (
    <>
      <Navbar />
      <RankedShowList shows={shows} />
    </>
  );
};

export default Home;
