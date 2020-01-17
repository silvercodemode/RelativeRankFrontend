import PropTypes from 'prop-types';
import { NextPage } from 'next';
import Navbar from '../components/Navbar';

const Home: NextPage<{ userAgent: string }> = ({ userAgent }) => <Navbar />;

Home.propTypes = {
  userAgent: PropTypes.string.isRequired,
};

Home.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] || '' : navigator.userAgent;
  return { userAgent };
};

export default Home;
