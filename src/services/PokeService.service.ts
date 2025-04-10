import { request } from "@nativescript/core/http";
import { forkJoin, from, throwError } from "rxjs";
import { map, catchError, mergeMap } from "rxjs/operators";
import { PokemonMapper } from "~/mappers/PokemonMapper"; // Ajusta la ruta si es necesario
import type PokemonInfo from "~/interfaces/PokemonInfo.interface";
import { PokeRes } from "~/interfaces/pokeRes.interface";
import { PokeResByType } from "~/interfaces/PokeResType.interface";
import { PokemonTypeMapper } from '../mappers/PokemonTypeMapper';


export default class PokeService {
  static searchPokemonByName = (query: string) => {
    query = query.toLowerCase();

    return from(
      request({
        url: `https://pokeapi.co/api/v2/pokemon/${query}`,
        method: "GET",
      })
    ).pipe(
      map((res) => {
        if (!res.content) {
          throw new Error("Respuesta sin contenido");
        }
        const json: PokeRes = JSON.parse(res.content.toString());
        return PokemonMapper.mapRestPokemonToPokemon(json) as PokemonInfo;
      }),
      catchError((error) => {
        console.log("Error al obtener el Pokémon", error);
        return throwError(() => new Error("No se pudo encontrar ese Pokémon."));
      })
    );
  };

  static searchPokemonByType = (query: string) => {
    query = query.toLowerCase();

    return from(
      request({
        url: `https://pokeapi.co/api/v2/type/${query}`,
        method: "GET",
      })
    ).pipe(
      map((res) => {
        if (!res.content) {
          throw new Error("Respuesta sin contenido");
        }
        const json: PokeResByType = JSON.parse(res.content.toString());
        return PokemonTypeMapper.mapToSimplePokemonList(json); // ← [{ name, url }]
      }),
      mergeMap((pokemonList) => {
        // Reutilizás searchPokemonByName para cada uno
        const requests = pokemonList.map((p: { name: string; url: string }) =>
          PokeService.searchPokemonByName(p.name)
        );
        return forkJoin(requests); // devuelve PokemonInfo[]
      }),
      catchError((error) => {
        console.error("Error al obtener Pokémon por tipo", error);
        return throwError(() => new Error("No se pudo obtener la lista de Pokémon."));
      })
    );
  };
  

}
