/* eslint-disable react/jsx-props-no-spreading */
import { NextComponentType } from 'next';
import PropTypes from 'prop-types';
import '../styles/styles.css';
import { AppContext, AppInitialProps, AppProps } from 'next/app';

const App: NextComponentType<AppContext, AppInitialProps, AppProps> = ({
  Component,
  pageProps,
}) => {
  return <Component {...pageProps} />;
};

App.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.any.isRequired,
};

export default App;
