
<script setup lang="ts">
import { $navigateTo, ref } from 'nativescript-vue';
import { usePokemonStore } from '../store/pokemonStore';
import PokeService from '../services/PokeService.service';
import { firstValueFrom } from 'rxjs';
import PokemonInfo from '../interfaces/PokemonInfo.interface';
import ShowPokemonList from './ShowPokemonList.vue';
import { ObservableArray } from '@nativescript/core';

// Lista de tipos de Pokémon comunes
const pokemonTypes = new ObservableArray([
  'normal', 'fire', 'water', 'grass', 'electric', 
  'ice', 'fighting', 'poison', 'ground', 'flying', 
  'psychic', 'bug', 'rock', 'ghost', 'dragon', 
  'dark', 'steel', 'fairy'
]);

const selectedType = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const store = usePokemonStore();

// Función para manejar la selección de un tipo
const onTypeTap = (event) => {
  const index = event.index;
  selectedType.value = pokemonTypes.getItem(index);
};

const buscarPokemon = async () => {
  if (!selectedType.value) {
    errorMessage.value = 'Por favor, selecciona un tipo de Pokémon';
    return;
  }

  errorMessage.value = '';
  isLoading.value = true;

  try {
    // Buscar Pokémon por tipo usando el servicio
    const resultados: PokemonInfo[] = await firstValueFrom(
      PokeService.searchPokemonByType(selectedType.value)
    );

    if (resultados.length === 0) {
      errorMessage.value = 'No se encontraron Pokémon de este tipo';
      isLoading.value = false;
      return;
    }

    // Guardar en la store
    store.setResultados(resultados);
    
    // Navegar a la pantalla de resultados
    $navigateTo(ShowPokemonList);
  } catch (error) {
    console.error("Error al buscar por tipo:", error);
    errorMessage.value = 'Error al buscar Pokémon. Intenta de nuevo.';
  } finally {
    isLoading.value = false;
  }
};
</script>

  <template>
    <Page class="bg-amber-50">
      <ActionBar title="Buscar por Tipo" class="bg-amber-500 text-white" />
      <GridLayout rows="auto, auto, auto, *" class="p-4">
        <Label row="0" text="Selecciona un tipo de Pokémon" class="text-lg font-bold mb-2 text-amber-800" />
        
        <ListView row="1" 
          :items="pokemonTypes" 
          @itemTap="onTypeTap"
          class="mb-4 bg-white border border-amber-300 rounded-lg h-40">
          <template #default="{ item }">
            <StackLayout :class="selectedType === item ? 'p-2 bg-amber-200' : 'p-2'">
              <Label :text="item" class="text-lg" />
            </StackLayout>
          </template>
        </ListView>
        
        <Button row="2" 
          text="Buscar" 
          @tap="buscarPokemon" 
          class="bg-amber-600 text-white font-bold p-3 rounded-lg" />
        
        <ActivityIndicator row="3" v-if="isLoading" busy="true" class="mt-4" />
        <Label row="3" v-if="errorMessage" :text="errorMessage" class="text-red-500 mt-4" />
      </GridLayout>
    </Page>
  </template>