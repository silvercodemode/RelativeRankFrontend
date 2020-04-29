import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import RankedShowList from '../components/RankedShowList';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  fetchRelativeRankedShowListIfEmpty,
  fetchRelativeRankedShowList,
} from '../redux/action-creators';
import { RelativeRankStore, RelativeRankedShow } from '../redux/store';

export default function Home() {
  const shows = useSelector<RelativeRankStore, RelativeRankedShow[]>(
    (state) => state.shows,
  );
  const loading = useSelector<RelativeRankStore, boolean>(
    (state) => state.isFetchingShows,
  );
  const page = useSelector<RelativeRankStore, number>((state) => state.page);
  const numberOfPages = useSelector<RelativeRankStore, number>(
    (state) => state.numberOfPages,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRelativeRankedShowListIfEmpty());
  }, [page]);

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="mt-40">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <RankedShowList
            shows={shows.map((show, i) => ({
              ...show,
              rank: i + 1 + (page - 1) * 100,
            }))}
          />
          <footer className="max-w-xl m-5 mx-auto text-center">
            <div className="flex flex-wrap justify-center">
              {(() => {
                const pageLinks = [];
                for (let i = 1; i <= numberOfPages; i += 1) {
                  const currentPage = i;
                  pageLinks.push(
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        dispatch(fetchRelativeRankedShowList(currentPage));
                      }}
                      className="m-2 p-1 max-w-xs bg-green-800 hover:bg-green-700 text-white text-xs rounded"
                    >
                      {`${i * 100 - 99} - ${i * 100}`}
                    </button>,
                  );
                }
                return pageLinks;
              })()}
            </div>
            <button
              type="button"
              className="m-4 p-2 rounded-lg shadow-md"
              onClick={() => {
                window.scrollTo({
                  top: 0,
                });
              }}
            >
              Back to Top
            </button>
          </footer>
        </>
      )}
    </>
  );
}

//
