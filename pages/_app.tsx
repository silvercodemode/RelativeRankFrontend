/* eslint-disable react/jsx-props-no-spreading */
import Head from 'next/head';
import PropTypes from 'prop-types';
import '../styles/styles.css';
import { Provider } from 'react-redux';
import store from '../redux/store';

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <title>Relative Rank</title>
        <meta
          name="Description"
          content="Rank anime relative to individual preference then map that to a global scale."
        />
        <link rel="icon" href="/images/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}

App.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.any.isRequired,
};

export default App;
