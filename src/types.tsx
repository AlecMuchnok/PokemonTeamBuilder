export interface APIData {
  name: string,
  url: string,
}

export interface Pokemon {
  id: number,
  species: string,
  sprite: string,
  types: Type[]
}

export interface Pokedex {
  name: string;
  pokemon: Map<string, number>; // pokemon species name -> entry_number
}

export interface Type {
  id: number,
  name: string,
  sprite: string,
  pokemon: Set<string>,
  type_effectiveness: {
    offense: Map<string, number>,
    defense: Map<string, number>,
  },
}