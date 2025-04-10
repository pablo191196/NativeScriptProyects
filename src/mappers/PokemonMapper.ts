import PokemonInfo from "~/interfaces/PokemonInfo.interface";
import { PokeRes } from "~/interfaces/pokeRes.interface";
import { map } from "rxjs";


export class PokemonMapper{

    static mapRestPokemonToPokemon(item:PokeRes):PokemonInfo{
      return{
        base_experience:item.base_experience,
        height:item.height,
        id:item.id,
        name:item.name,
        order:item.order,
        weight:item.weight,
        sprites:{
          front_default:item.sprites.front_default,
          back_default:item.sprites.back_default,
          front_shiny:item.sprites.front_shiny,
          back_shiny:item.sprites.back_shiny
        }
      }
    }
  
    static mapRestPokemonToPokemonArray(items:PokeRes[]):PokemonInfo[]{
      return items.map(this.mapRestPokemonToPokemon);
    }
  }