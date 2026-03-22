import { createContext } from "react";
import type { APIData, Pokemon, Type, Pokedex } from "./types";

export const DataContext = createContext<{ allPokemon: APIData[], allTypes: Type[], allPokedexes: Pokedex[], idToSpecies: Map<number, string> }>({
  allPokemon: [],
  allTypes: [],
  allPokedexes: [],
  idToSpecies: new Map(),
});

export const TeamContext = createContext<{
  team: Pokemon[],
  onPokemonClick: (pokemon: Pokemon) => void
}>({
  team: [],
  onPokemonClick: () => {},
});