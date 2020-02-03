/* eslint-disable react/jsx-props-no-spreading */
import { NextComponentType } from 'next';
import PropTypes from 'prop-types';
import '../styles/styles.css';
import { AppContext, AppInitialProps, AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { withReduxStore } from '../redux/withReduxStore';

const App: NextComponentType<AppContext, AppInitialProps, AppProps> = ({
  Component,
  pageProps,
}) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

App.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.any.isRequired,
};

export default App;
