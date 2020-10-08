import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { UsersReducer } from "../users/reducers";

export function createStore(history: any) {
  return reduxCreateStore(
    combineReducers({
      users: UsersReducer,
      router: connectRouter(history),
    }),
    composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk))
  );
}
