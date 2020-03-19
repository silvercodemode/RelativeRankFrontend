import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import UserShowList from '../components/UserShowList';
import { fetchUserShowList } from '../redux/action-creators';
import { RelativeRankStore, User } from '../redux/store';

export default function ShowList() {
  const user = useSelector<RelativeRankStore, User>((state) => state.user);
  const dispatch = useDispatch();

  console.log(user);
  useEffect(() => {
    dispatch(fetchUserShowList());
  }, []);

  return (
    <>
      <Navbar />
      <UserShowList shows={user && user.showList ? user.showList : []} />
    </>
  );
}
