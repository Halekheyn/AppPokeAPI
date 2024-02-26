// Generated by https://quicktype.io

export interface PokemonTable {
  id:       number | null;
  name:     string;
  urlImage: string;
  height:   string;
  weight:   string;
  abilities: Ability[]
}

interface Ability {
  display: string;
  value: string;
}
