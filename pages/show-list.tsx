/* eslint-disable no-nested-ternary */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import UserShowList from '../components/UserShowList';
import { fetchUserShowList } from '../redux/action-creators';
import { RelativeRankStore, User, RelativeRankedShow } from '../redux/store';

export default function ShowList() {
  const user = useSelector<RelativeRankStore, User>((state) => state.user);
  const dispatch = useDispatch();
  const [showList, setShowList] = useState<RelativeRankedShow[]>([]);
  useEffect(() => {
    if (user) {
      dispatch(fetchUserShowList());
      setShowList(user && user.showList ? user.showList : []);
    }
  }, [user ? (user.showList ? user.showList.length : user.showList) : user]);

  return (
    <>
      <Navbar />
      {user && (
        <h2 className="m-3 text-center text-2xl">
          {user.username}
          &apos;s Anime List
        </h2>
      )}
      <UserShowList shows={showList} setShowList={setShowList} />
    </>
  );
}
