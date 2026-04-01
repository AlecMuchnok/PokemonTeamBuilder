import { useState, useEffect, useMemo } from 'react'
import './App.css'
import { FilterablePokemonTable } from './PokemonTable';
import { PokemonTeam } from './PokemonTeam';
import { TeamCoverage } from './TeamCoverage';
import { DataContext } from './AppContext';
import { flattenDamageRelations } from './utilities';
import type { APIData, Type, Pokedex } from './types';

export default function App() {
  return (
    <DataContextProvider>
      <div className="flex flex-wrap justify-center items-start min-h-screen p-4">
        <PokemonTeam />
        <TeamCoverage />
        <FilterablePokemonTable />
      </div>
    </DataContextProvider>
  )
}

const DataContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allPokemon, setAllPokemon] = useState<APIData[]>([]);
	const [allTypes, setAllTypes] = useState<Type[]>([]);
  const [allPokedexes, setAllPokedexes] = useState<Pokedex[]>([]);
  const [idToSpecies, setIdToSpecies] = useState<Map<number, string>>(new Map());

  const TYPE_COUNT = 18;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000');
      const json = await response.json();
      setAllPokemon(json.results);

      const types : Type[] = [];

      for (let i = 1; i <= TYPE_COUNT; i++) {
        const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${i}`);
        const typeJson = await typeResponse.json();
        types.push({
          id: typeJson.id,
          name: typeJson.name,
          sprite: typeJson.sprites['generation-ix']['scarlet-violet'].name_icon,
          pokemon: new Set<string>(typeJson.pokemon.map((entry: { pokemon: { name: string } }) => entry.pokemon.name)),
          type_effectiveness: flattenDamageRelations(typeJson.damage_relations),
        });
      }

      setAllTypes(types);

      const pdxListResponse = await fetch('https://pokeapi.co/api/v2/pokedex?limit=100');
      const pdxListJson = await pdxListResponse.json();

      const pokedexes: Pokedex[] = await Promise.all(
        pdxListJson.results.map(async (pdx: APIData) => {
          const pdxResponse = await fetch(pdx.url);
          const pdxJson = await pdxResponse.json();

          const displayName = pdxJson.name
            .split('-')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          const pokemon = new Map<string, number>(
            pdxJson.pokemon_entries.map((e: { entry_number: number; pokemon_species: { name: string } }) => [
              e.pokemon_species.name,
              e.entry_number,
            ])
          );

          return { name: displayName, pokemon };
        })
      );

      setAllPokedexes(pokedexes);

      const nationalPokedex = pokedexes.find((p) => p.name.toLowerCase() === 'national');
      if (nationalPokedex) {
        const speciesMap = new Map<number, string>();
        nationalPokedex.pokemon.forEach((entryNumber, speciesName) => {
          speciesMap.set(entryNumber, speciesName);
        });
        setIdToSpecies(speciesMap);
      }
    }

    fetchData();
  }, []);

  const contextValue = useMemo(() => ({
    allPokemon, allTypes, allPokedexes, idToSpecies
  }), [allPokemon, allTypes, allPokedexes, idToSpecies]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  )
}
