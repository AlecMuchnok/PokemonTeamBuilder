import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { APIData, Pokedex, Type } from '../types';
import type { APIResponse } from './apiTypes';

export const pokeApi = createApi({
	reducerPath: 'pokeApi',
	baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
	endpoints: (builder) => ({
		getAllPokemon: builder.query<APIData[], void>({
			query: () => 'pokemon?limit=2000',
			transformResponse: (response: APIResponse<APIData>) => response.results,
		}),
		getAllPokedexes: builder.query<Pokedex[], void>({
			query: () => 'pokedex?limit=100',
			transformResponse: (response: APIResponse<Pokedex>) => response.results,
		}),
		getType: builder.query<Type, number>({
			query: (id) => `type/${id}`,
		}),
	}),
})

export const {
	useGetAllPokemonQuery,
	useGetAllPokedexesQuery,
	useGetTypeQuery,
} = pokeApi