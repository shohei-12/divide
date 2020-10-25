import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { connectRouter, routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { UsersReducer } from "../users/reducers";

const persistConfig = {
  key: "root",
  storage,
};

export function createStore(history: any) {
  return reduxCreateStore(
    persistReducer(
      persistConfig,
      combineReducers({
        users: UsersReducer,
        router: connectRouter(history),
      })
    ),
    composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk))
  );
}
