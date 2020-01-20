import { NextPage } from 'next';
import Navbar from '../components/Navbar';
import RankedShowList from '../components/RankedShowList';

const Home: NextPage<{ userAgent: string }> = () => (
  <>
    <Navbar />
    <RankedShowList
      shows={[
        { name: 'Eva', percentileRank: 0.75 },
        { name: 'Love Live', percentileRank: 0.25 },
      ]}
    />
  </>
);

export default Home;
