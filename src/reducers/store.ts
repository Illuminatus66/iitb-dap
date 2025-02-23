import {configureStore, combineReducers} from '@reduxjs/toolkit';
import reportsReducer from "../reducers/reportsSlice"

const rootReducer = combineReducers({
  reports: reportsReducer,
});

//wrapping reducers for extensibility so that 
export const store = configureStore({
  reducer: rootReducer
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
