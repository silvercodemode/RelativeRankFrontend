import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../redux/action-creators';
import { RelativeRankStore } from '../redux/store';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const state = useSelector<RelativeRankStore, RelativeRankStore>((s) => s);
  const dispatch = useDispatch();
  const router = useRouter();

  if (state.user) {
    router.push('/index');
  }

  return (
    <main className="max-w-xl m-5 mx-auto mx-auto">
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
            className="flex-grow appearance-none m-2 p-1 border-1 border-green-800 rounded focus:outline-none focus:shadow-outline"
            onChange={(event) => setUsername(event.target.value)}
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
            className="flex-grow appearance-none m-2 p-1 border-1 border-green-800 rounded focus:outline-none focus:shadow-outline"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button
          type="button"
          className="m-2 max-w-xs bg-green-800 hover:bg-green-700 text-white text-lg py-2 px-4 rounded flex-grow-0"
          onClick={() => {
            dispatch(signUp({ username, password }));
          }}
        >
          Submit
        </button>
      </form>
    </main>
  );
}
