import { map } from "rxjs";
import { PokeResByType } from "~/interfaces/PokeResType.interface";
import PokemonByType, { PokemonsInType } from "~/interfaces/PokemonByType";

export class PokemonTypeMapper {
  static mapToSimplePokemonList(
    item: PokeResByType
  ): { name: string; url: string }[] {
    return item.pokemon.map((p) => ({
      name: p.pokemon.name,
      url: p.pokemon.url,
    }));
  }
}
