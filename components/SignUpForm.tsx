import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { signUp, resetSignUpOrLogin } from '../redux/action-creators';
import { RelativeRankStore } from '../redux/store';
import LoadingSpinner from './LoadingSpinner';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const state = useSelector<RelativeRankStore, RelativeRankStore>((s) => s);
  const dispatch = useDispatch();
  const router = useRouter();

  if (state.user) {
    router.push('/index');
  }

  if (state.signInFailed) {
    dispatch(resetSignUpOrLogin());
    alert('Sign in failed, Username is taken');
  }

  function submitForm() {
    dispatch(signUp({ username, password }));
    setUsername('');
    setPassword('');
  }

  function onKeyPress(event) {
    if (event.key === 'Enter') {
      submitForm();
    }
  }

  return (
    <main className="max-w-xl m-5 mx-auto mx-auto">
      {state.attemptingSignUpOrLogin ? (
        <div className="m-20">
          <LoadingSpinner />
        </div>
      ) : (
        <form className="m-5 shadow-md p-3 rounded-lg flex flex-col justify-center items-center">
          <h2 className="text-center text-2xl">Sign Up</h2>
          <div className="flex-auto flex justify-between">
            <label htmlFor="username" className="text-lg m-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              className="flex-grow border-solid border-4 m-2 p-1 rounded focus:outline-none focus:shadow-outline"
              onChange={(event) => setUsername(event.target.value)}
              onKeyPress={onKeyPress}
            />
          </div>
          <div className="flex-auto flex justify-between">
            <label htmlFor="username" className="text-lg m-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              className="flex-grow border-solid border-4 m-2 p-1 rounded focus:outline-none focus:shadow-outline"
              onChange={(event) => setPassword(event.target.value)}
              onKeyPress={onKeyPress}
            />
          </div>
          <button
            type="button"
            className="m-2 max-w-xs bg-green-800 hover:bg-green-700 text-white text-lg py-2 px-4 rounded flex-grow-0"
            onClick={submitForm}
          >
            Submit
          </button>
        </form>
      )}
    </main>
  );
}
