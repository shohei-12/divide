import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { createStore } from "./re-ducks/store/store";
import { ConnectedRouter } from "connected-react-router";
import * as History from "history";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const history = History.createBrowserHistory();
const store = createStore(history);
const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
