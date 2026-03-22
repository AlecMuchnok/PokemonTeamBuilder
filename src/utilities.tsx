import type { Type } from "./types";

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
  // Maps type name to effectiveness
  const offense : Map<string, number> = new Map();

  for (const type of damage_relations.double_damage_to) {
    offense.set(type.name, 2);
  }

  for (const type of damage_relations.half_damage_to) {
    offense.set(type.name, 0.5);
  }

  for (const type of damage_relations.no_damage_to) {
    offense.set(type.name, 0);
  }

  const defense : Map<string, number> = new Map();

  for (const type of damage_relations.double_damage_from) {
    defense.set(type.name, 2);
  }

  for (const type of damage_relations.half_damage_from) {
    defense.set(type.name, 0.5);
  }

  for (const type of damage_relations.no_damage_from) {
    defense.set(type.name, 0);
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