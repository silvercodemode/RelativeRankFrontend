import { NextPage } from 'next';
import Navbar from '../components/Navbar';

const UsersShowList: NextPage<{ userAgent?: string }> = () => {
  return (
    <>
      <Navbar />
    </>
  );
};

export default UsersShowList;
