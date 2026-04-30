import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { APIData, Pokedex, Type } from '../types';
import type { APIResponse } from './apiTypes';
import { flattenDamageRelations } from '../utilities';

export const pokeApi = createApi({
	reducerPath: 'pokeApi',
	baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
	endpoints: (builder) => ({
		getAllPokemon: builder.query<APIData[], void>({
			query: () => 'pokemon?limit=2000',
			transformResponse: (response: APIResponse) => response.results,
		}),
		getAllPokedexes: builder.query<APIData[], void>({
			query: () => 'pokedex?limit=100',
			transformResponse: (response: APIResponse) =>
				response.results.map((r) => ({
					...r,
					name: r.name
						.split('-')
						.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
						.join(' '),
				})),
		}),
		getPokedex: builder.query<Pokedex, string>({
			query: (name) => `pokedex/${name}`,
			transformResponse: (response: {
				name: string;
				pokemon_entries: { entry_number: number; pokemon_species: { name: string } }[];
			}): Pokedex => ({
				name: response.name,
				pokemon: Object.fromEntries(
					response.pokemon_entries.map((e) => [e.pokemon_species.name, e.entry_number])
				),
			}),
		}),
		getType: builder.query<Type, string | number>({
			query: (idOrName) => `type/${idOrName}`,
			transformResponse: (response: {
				id: number;
				name: string;
				sprites: { 'generation-ix': { 'scarlet-violet': { name_icon: string } } };
				pokemon: { pokemon: { name: string } }[];
				damage_relations: Parameters<typeof flattenDamageRelations>[0];
			}): Type => ({
				id: response.id,
				name: response.name,
				sprite: response.sprites['generation-ix']['scarlet-violet'].name_icon,
				pokemon: response.pokemon.map((entry) => entry.pokemon.name),
				type_effectiveness: flattenDamageRelations(response.damage_relations),
			}),
		}),
	}),
})

export const {
	useGetAllPokemonQuery,
	useGetAllPokedexesQuery,
	useGetPokedexQuery,
	useGetTypeQuery,
} = pokeApi