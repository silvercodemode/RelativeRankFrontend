import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';
import RankedShowList from '../../../components/RankedShowList';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { userShowlistUrlMaker } from '../../../urls';
import { RelativeRankedShow } from '../../../redux/store';

async function fetchOtherUsersShows(
  username: string,
  setOtherUsername: React.Dispatch<React.SetStateAction<RelativeRankedShow[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) {
  try {
    const response = await fetch(userShowlistUrlMaker(username));
    const shows: RelativeRankedShow[] = await response.json();
    setOtherUsername(shows);
  } catch (err) {
    setOtherUsername(null);
  } finally {
    setIsLoading(false);
  }
}

export default function index() {
  const router = useRouter();
  const [otherUsersShows, setOtherUsersShows] = useState<RelativeRankedShow[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    if (typeof router.query.username === 'string') {
      fetchOtherUsersShows(
        router.query.username,
        setOtherUsersShows,
        setIsLoading,
      );
    }
  }, [router.query.username]);

  return (
    <>
      <Navbar />
      {isLoading ? (
        <LoadingSpinner />
      ) : otherUsersShows !== null ? (
        <>
          <h2 className="max-w-xl mt-5 mx-auto text-2xl text-center">
            {router.query.username}'s Showlist
          </h2>
          <RankedShowList shows={otherUsersShows} />
        </>
      ) : (
        <h2 className="max-w-xl mt-5 mx-auto text-2xl text-center">
          {`User "${router.query.username}" does not exist.`}
        </h2>
      )}
    </>
  );
}
