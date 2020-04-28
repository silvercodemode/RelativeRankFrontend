import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import RankedShowList from '../components/RankedShowList';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchRelativeRankedShowListIfEmpty } from '../redux/action-creators';
import { RelativeRankStore, RelativeRankedShow } from '../redux/store';

export default function Home() {
  const shows = useSelector<RelativeRankStore, RelativeRankedShow[]>(
    (state) => state.shows,
  );
  const loading = useSelector<RelativeRankStore, boolean>(
    (state) => state.isFetchingShows,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRelativeRankedShowListIfEmpty());
  }, []);

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="mt-40">
          <LoadingSpinner />
        </div>
      ) : (
        <RankedShowList shows={shows} />
      )}
    </>
  );
}
