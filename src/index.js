import React from 'react';
import ReactDOM from 'react-dom';
import 'react-toastify/dist/ReactToastify.css';
import './styles/styles.scss';

import App from './containers/App';
import * as serviceWorker from './serviceWorker';
import IntlProviderWrapper from "./hoc/IntlProviderWrapper";

import { Provider } from 'react-redux';
import reduxStore, { persistor } from './redux';
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate

const renderApp = () => {
    ReactDOM.render(
        <Provider store={reduxStore}>
            {/* Chờ redux-persist khôi phục trạng thái */}
            <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
                <IntlProviderWrapper>
                    <App persistor={persistor} />
                </IntlProviderWrapper>
            </PersistGate>
        </Provider>,
        document.getElementById('root')
    );
};

renderApp();

// Nếu muốn kích hoạt service worker (PWA)
serviceWorker.unregister();
