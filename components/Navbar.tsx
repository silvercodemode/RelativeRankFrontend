import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { RelativeRankStore, User } from '../redux/store';
import { signOut, successfulSignUpOrLogin } from '../redux/action-creators';

export default function Navbar() {
  const user = useSelector<RelativeRankStore, User>((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (user === null) {
      const usernameFromLocalStorage = localStorage.getItem('username');
      const tokenFromLocalStorage = localStorage.getItem('token');

      const defaultUser =
        usernameFromLocalStorage && tokenFromLocalStorage
          ? {
              username: usernameFromLocalStorage,
              token: tokenFromLocalStorage,
              showList: null,
            }
          : null;

      if (defaultUser) {
        dispatch(
          successfulSignUpOrLogin({
            id: null,
            username: defaultUser.username,
            password: null,
            token: defaultUser.token,
          }),
        );
      }
    }
  }, [user ? user.username : null]);

  function signOutNav() {
    dispatch(signOut());
    router.push('/');
  }

  function signOutKeydown(event) {
    if (event.key === 'Enter') {
      signOutNav();
    }
  }

  return (
    <nav className="flex items-center justify-between flex-wrap bg-green-800 p-6">
      <header className="flex items-center flex-shrink-0 text-white mr-6">
        <h1 className="font-semibold text-xl tracking-tight">RelativeRank</h1>
      </header>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-lg lg:flex-grow">
          <Link href="/">
            <a className="block mt-4 lg:inline-block lg:mt-0 text-green-200 hover:text-white mr-4">
              Home
            </a>
          </Link>
          {user && (
            <Link href="show-list">
              <a className="block mt-4 lg:inline-block lg:mt-0 text-green-200 hover:text-white mr-4">
                Your List
              </a>
            </Link>
          )}
          <Link href="about">
            <a
              href="About"
              className="block mt-4 lg:inline-block lg:mt-0 text-green-200 hover:text-white"
            >
              About
            </a>
          </Link>
        </div>
      </div>
      {!user ? (
        <div className="w-full block text-lg lg:flex lg:flex-grow lg:justify-end lg:flex lg:items-center lg:w-auto">
          <Link href="sign-up">
            <a className="block mr-3 mt-4 lg:inline-block lg:mt-0 text-green-200 hover:text-white">
              Sign Up
            </a>
          </Link>
          <Link href="login">
            <a className="block mt-4 lg:inline-block lg:mt-0 text-green-200 hover:text-white">
              Login
            </a>
          </Link>
        </div>
      ) : (
        <button type="button" onClick={signOutNav} onKeyDown={signOutKeydown}>
          <Link href="index">
            <a className="block mr-3 mt-4 lg:inline-block lg:mt-0 text-green-200 hover:text-white">
              Sign Out
            </a>
          </Link>
        </button>
      )}
    </nav>
  );
}
