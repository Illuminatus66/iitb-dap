import { combineReducers, configureStore } from "@reduxjs/toolkit";
import reportsReducer from "../reducers/reportsSlice";

// Wrapping reducers using combineReducers for extensibility so that
// more reducers can be added if needed. Like a reducer for user details
// in case multiple teachers want to create accounts on this platform.
const rootReducer = combineReducers({
  reports: reportsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;
