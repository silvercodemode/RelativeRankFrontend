/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import '../styles/styles.css';
import { Provider } from 'react-redux';
import store from '../redux/store';

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

App.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.any.isRequired,
};

export default App;
