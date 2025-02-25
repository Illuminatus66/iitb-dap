import { configureStore } from "@reduxjs/toolkit";
import reportsReducer from "../reducers/reportsSlice";

// Wrapping reducers using combineReducers for extensibility so that
// more reducers can be added if needed. Like a reducer for user details
// in case multiple teachers want to create accounts on this platform.
// const rootReducer = combineReducers({
//   reports: reportsReducer,
// });

export const store = configureStore({
  reducer: reportsReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
