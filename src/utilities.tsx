import type { Type } from "./types";

export const TYPE_IDS: Record<string, number> = {
  normal: 1,
  fighting: 2,
  flying: 3,
  poison: 4,
  ground: 5,
  rock: 6,
  bug: 7,
  ghost: 8,
  steel: 9,
  fire: 10,
  water: 11,
  grass: 12,
  electric: 13,
  psychic: 14,
  ice: 15,
  dragon: 16,
  dark: 17,
  fairy: 18,
};

const DISPLAY_NAME_OVERRIDES: Record<string, string> = {
  'nidoran-f': 'Nidoran\u2640',
  'nidoran-m': 'Nidoran\u2642',
  'mr-mime': 'Mr. Mime',
  'mr-rime': 'Mr. Rime',
  'mime-jr': 'Mime Jr.',
  'type-null': 'Type: Null',
};

export function formatPokemonName(species: string): string {
  if (DISPLAY_NAME_OVERRIDES[species]) return DISPLAY_NAME_OVERRIDES[species];
  return species.charAt(0).toUpperCase() + species.slice(1);
}

export function flattenDamageRelations(damage_relations: DamageRelations) {
  const offense : Record<string, number> = {};

  for (const type of damage_relations.double_damage_to) {
    offense[type.name] = 2;
  }

  for (const type of damage_relations.half_damage_to) {
    offense[type.name] = 0.5;
  }

  for (const type of damage_relations.no_damage_to) {
    offense[type.name] = 0;
  }

  const defense : Record<string, number> = {};

  for (const type of damage_relations.double_damage_from) {
    defense[type.name] = 2;
  }

  for (const type of damage_relations.half_damage_from) {
    defense[type.name] = 0.5;
  }

  for (const type of damage_relations.no_damage_from) {
    defense[type.name] = 0;
  }

  return { offense, defense }
}

interface DamageRelations {
  double_damage_from: Type[],
  double_damage_to: Type[],
  half_damage_from: Type[],
  half_damage_to: Type[],
  no_damage_from: Type[],
  no_damage_to: Type[],
}