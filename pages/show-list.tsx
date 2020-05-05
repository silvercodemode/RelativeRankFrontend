import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import UserShowList from '../components/UserShowList';
import { RelativeRankStore, User } from '../redux/store';

export default function ShowList() {
  const user = useSelector<RelativeRankStore, User>((state) => state.user);

  return (
    <>
      <Navbar />
      {user && (
        <h2 className="m-3 text-center text-2xl">
          {user.username}
          &apos;s Anime List
        </h2>
      )}
      <UserShowList />
    </>
  );
}
