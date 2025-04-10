

export default interface PokemonByType {
    id:                    number;
    name:                  string;
    pokemon:               PokemonsInType[];
}

export interface PokemonsInType {
   name: string,
    url: string
}