import { configureStore } from '@reduxjs/toolkit';
import teamReducer from './teamSlice';
import { pokeApi } from '../services/pokeApi';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
	reducer: {
		team: teamReducer,
		[pokeApi.reducerPath]: pokeApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(pokeApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;