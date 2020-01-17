import React from 'react';

function Navbar() {
  return (
    <nav className="flex items-center justify-between flex-wrap bg-green-800 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <h1 className="font-semibold text-xl tracking-tight">RelativeRank</h1>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-lg lg:flex-grow">
          <a
            href="#responsive-header"
            className="block mt-4 lg:inline-block lg:mt-0 text-green-200 hover:text-white mr-4"
          >
            Docs
          </a>
          <a
            href="#responsive-header"
            className="block mt-4 lg:inline-block lg:mt-0 text-green-200 hover:text-white mr-4"
          >
            Examples
          </a>
          <a
            href="#responsive-header"
            className="block mt-4 lg:inline-block lg:mt-0 text-green-200 hover:text-white"
          >
            Blog
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
