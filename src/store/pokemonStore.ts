// store/pokemonStore.ts
import { defineStore } from 'pinia';
import type PokemonInfo from '~/interfaces/PokemonInfo.interface';

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    resultados: [] as PokemonInfo[],
  }),

  actions: {
    setResultados(pokemons: PokemonInfo[]) {
      this.resultados = pokemons;
    },
  },
});
