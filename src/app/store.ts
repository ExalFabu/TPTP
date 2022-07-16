import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import averageReducer, {
  createInitialAverage,
  IAverage,
} from '../features/average/averageDuck';
import lecturesReducer, {
  createEmptyLecture,
  ILecture,
} from '../features/lectures/lectureDuck';
import preferencesReducer, {
  createInitialPreferences,
  IPreferences,
} from '../features/preferences/preferencesDuck';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { persistStore, persistReducer } from "redux-persist";

export interface IAppState {
  lectures: ILecture[];
  preferences: IPreferences;
  options: IAverage;
}

const persistConfig = {
  key: 'TPTP',
  storage,
}
const rootReducer = combineReducers({
  lectures: lecturesReducer,
  preferences: preferencesReducer,
  options: averageReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer)


// TODO: Use redux-persist
const initialStorageState = {
  lectures: [createEmptyLecture()],
  preferences: createInitialPreferences(),
  options: createInitialAverage(),
} as IAppState;

const logger = createLogger({});



export const store = configureStore({
  reducer: persistedReducer,
  preloadedState: initialStorageState,
  devTools: true,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware().concat(logger);
  },
});

export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store)