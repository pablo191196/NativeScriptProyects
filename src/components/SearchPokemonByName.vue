<script setup lang="ts">
import { $navigateTo, ref, onMounted } from 'nativescript-vue';

// Variable to track animation timer
let animationTimerId: ReturnType<typeof setTimeout> | null = null;
import { usePokemonStore } from '../store/pokemonStore';
import PokeService from '../services/PokeService.service';
import { firstValueFrom } from 'rxjs';
import PokemonInfo from '../interfaces/PokemonInfo.interface';
import ShowPokemonList from './ShowPokemonList.vue';
import { Label, ObservableArray } from '@nativescript/core';

// Estado de la búsqueda
const searchText = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const store = usePokemonStore();

// Historial de búsquedas (simulado - en una app real podría guardarse en localStorage o base de datos)
const searchHistory = ref(new ObservableArray<string>(['pikachu', 'charizard', 'bulbasaur', 'squirtle']));

// Sugerencias para autocompletado
const suggestions = ref(new ObservableArray<string>([]));

// Función para buscar Pokémon
const searchPokemon = async () => {
  if (!searchText.value.trim()) {
    errorMessage.value = "Por favor ingresa un nombre de Pokémon";
    return;
  }
  
  try {
    isLoading.value = true;
    errorMessage.value = "";
    
    const res: PokemonInfo = await firstValueFrom(PokeService.searchPokemonByName(searchText.value.toLowerCase()));
    
    // Guarda en la store
    store.setResultados([res]);
    
    // Añade al historial si no existe
    if (!searchHistory.value.some(item => item.toLowerCase() === searchText.value.toLowerCase())) {
      searchHistory.value.unshift(searchText.value.toLowerCase());
      // Mantener solo los últimos 10 elementos
      if (searchHistory.value.length > 10) {
        searchHistory.value.pop();
      }
    }
    
    // Navega a la pantalla de resultados
    $navigateTo(ShowPokemonList);
  } catch (error) {
    console.error("Error al buscar:", error);
    errorMessage.value = "No se encontró el Pokémon. Verifica el nombre e intenta de nuevo.";
  } finally {
    isLoading.value = false;
  }
};

// Definición de tipos para los eventos
interface ItemTapEventData {
  index: number;
  object: any;
  view: any;
}

interface TextFieldEventData {
  object: any;
  value: string;
}

interface PageLoadedEventData {
  object: any;
  eventName: string;
}

// Función para manejar la selección de una sugerencia
const onSuggestionTap = (args: ItemTapEventData) => {
  const index = args.index;
  searchText.value = suggestions.value.getItem(index);
  searchPokemon();
};

// Función para manejar la selección del historial
const onHistoryTap = (args: ItemTapEventData) => {
  const index = args.index;
  searchText.value = searchHistory.value.getItem(index);
  searchPokemon();
};

// Función para filtrar sugerencias basadas en el texto ingresado
const onTextChanged = (args: TextFieldEventData) => {
  const searchValue = args.value.toLowerCase();
  
  if (!searchValue) {
    suggestions.value = new ObservableArray<string>([]);
    return;
  }
  
  // Filtra el historial para mostrar sugerencias
  const filtered = searchHistory.value.filter(item => 
    item.toLowerCase().includes(searchValue)
  );
  
  // Convertir el ObservableArray a array normal antes de crear uno nuevo
  const filteredArray = Array.from(filtered);
  suggestions.value = new ObservableArray<string>(filteredArray);
};

// Función para limpiar la animación cuando la página se descarga
function onPageUnloaded() {
  if (animationTimerId !== null) {
    clearTimeout(animationTimerId);
    animationTimerId = null;
    console.log("Animacion detenida");
  }
}

// Animación del fondo con gradiente cíclico usando generación dinámica de colores
function onPageLoaded(args: PageLoadedEventData) {
  // Si ya hay una animación en curso, no iniciar otra
  if (animationTimerId !== null) {
    console.log("Animacion actualmente en curso, no se inicia otra");
    return;
  }
  const page = args.object;
  const gradientBg = page.getViewById('gradientBackground');
  
  if (gradientBg) {
    // Valor inicial del tono (hue) en el espacio de color HSL
    let baseHue = 0;
    
    // Función para convertir HSL a Hex
    function hslToHex(h: number, s: number, l: number): string {
      // tono esté entre 0 y 360
      h = h % 360;
      if (h < 0) h += 360;
      
      // Convertimos HSL a RGB
      s /= 100;
      l /= 100;
      
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;
      
      let r, g, b;
      
      if (h >= 0 && h < 60) {
        [r, g, b] = [c, x, 0];
      } else if (h >= 60 && h < 120) {
        [r, g, b] = [x, c, 0];
      } else if (h >= 120 && h < 180) {
        [r, g, b] = [0, c, x];
      } else if (h >= 180 && h < 240) {
        [r, g, b] = [0, x, c];
      } else if (h >= 240 && h < 300) {
        [r, g, b] = [x, 0, c];
      } else {
        [r, g, b] = [c, 0, x];
      }
      
      // Convertimos RGB a Hex
      const toHex = (value: number) => {
        const hex = Math.round((value + m) * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };
      
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    
    // Función para generar los colores del gradiente basados en el tono base
    function generateGradientColors(baseHue: number) {
      // Generamos tres colores con diferencia de tono para crear un gradiente suave
      // Usamos alta saturación (80%) y luminosidad media (60%) para colores vibrantes
      const startColor = hslToHex(baseHue, 80, 70);
      const middleColor = hslToHex((baseHue + 40) % 360, 80, 60);
      const endColor = hslToHex((baseHue + 80) % 360, 80, 50);
      
      return { start: startColor, middle: middleColor, end: endColor };
    }
    
    function updateGradient() {
      try {
        // Generamos los colores dinámicamente
        const currentColors = generateGradientColors(baseHue);
        
        // Actualizamos el gradiente
        gradientBg.style.backgroundImage = 
          `linear-gradient(270deg, ${currentColors.start}, ${currentColors.middle}, ${currentColors.end})`;
        
        // Incrementamos el tono base para la próxima actualización
        // Un incremento de 15 grados por paso crea una transición suave
        baseHue = (baseHue + 15) % 360;
        
        // Programa la siguiente actualización y guarda el ID
        animationTimerId = setTimeout(updateGradient, 75);
      } catch (error) {
        console.error("Error en la animación del gradiente:", error);
      }
    }
    
    // Inicia el ciclo
    
    updateGradient();
    
    // Añade una clase para activar la animación CSS
    gradientBg.className = gradientBg.className + " animate-gradient";
  }
}

// Importar ShowPokemonList como componente sin default export
// Esta es una solución para el error de TypeScript, pero no afecta la funcionalidad
</script>

<template>
  <Page actionBarHidden="true" @loaded="onPageLoaded" @unloaded="onPageUnloaded" class="page">
    <RootLayout>
      <!-- Fondo animado usando id y de manera programatica -->
      <ContentView id="gradientBackground" />
      
      <!-- Contenido principal -->
      <GridLayout rows="auto, auto, 5, auto, 5, auto, auto" class="content p-4">
        <!-- Encabezado -->
        <StackLayout row="0" class="header p-2">
          <Label text="Buscar Pokémon" class="title text-center text-2xl font-bold text-white m-b-4" />
          <Label text="Ingresa el nombre de un Pokémon para buscarlo" class="subtitle text-center text-white" />
        </StackLayout>
        
        <!-- Campo de busqyueda -->
        <GridLayout row="1" columns="*, 5 ,100" class="search-container m-y-4">
          <TextField col="0" v-model="searchText" 
                    hint="Nombre del Pokémon" 
                    @textChange="onTextChanged"
                    returnKeyType="search" 
                    @returnPress="searchPokemon"
                    class="input p-3 bg-white rounded-lg" />
          
          <Button col="2" text="Buscar" 
                 @tap="searchPokemon" 
                 class="search-btn bg-red-500 text-white font-bold p-3 rounded-lg m-l-2" />
        </GridLayout>
        
        <!-- Sugerencias -->
        <StackLayout row="3" v-if="suggestions.length > 0" class="suggestions-container bg-white rounded-lg p-2 m-y-2">
          <Label text="Sugerencias" class="text-gray-500 p-2" />
          <ListView :items="suggestions" @itemTap="onSuggestionTap" height="120" class="suggestions-list">
            <template #default="{ item }">
              <Label :text="item" class="suggestion-item p-2 border-b border-gray-200" />
            </template>
          </ListView>
        </StackLayout>
        
        <!-- Historial de búsqueda -->
        <StackLayout row="5" class="history-container bg-white rounded-lg p-2 m-y-2">
          <Label text="Búsquedas recientes" class="text-gray-500 p-2" />
          <ListView :items="searchHistory" @itemTap="onHistoryTap" height="200" class="history-list">
            <template #default="{ item }">
              <GridLayout columns="auto, *" class="history-item p-2 border-b border-gray-200">
                <Label col="0" text="🔍" class="m-r-2" />
                <Label col="1" :text="item" />
              </GridLayout>
            </template>
          </ListView>
        </StackLayout>
        
        <!-- Indicador de carga y mensajes de error -->
        <StackLayout row="6" class="status-container">
          <ActivityIndicator :busy="isLoading" class="m-t-10" />
          <Label v-if="errorMessage" :text="errorMessage" class="error-message text-red-500 text-center p-2" />
        </StackLayout>
      </GridLayout>
    </RootLayout>
  </Page>
</template>

<style scoped>
.page {
  background-color: transparent;
}


.content {
  width: 100%;
  height: 100%;
}

.header {
  margin-top: 20;
}

.title {
  font-size: 24;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.subtitle {
  font-size: 14;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.search-container {
  margin: 10 15 10 15;
  ;
}

.input {
  padding: 12;
  border-radius: 8;
  background-color: white;
}

.search-btn {
  border-radius: 8;
  background-color: #ff5252;
  color: white;
  font-weight: bold;
}

.suggestions-container, .history-container {
  border-radius: 8;
  background-color: white;
  margin: 5 15;
}

.suggestion-item, .history-item {
  padding: 10;
  border-bottom-width: 1;
  border-bottom-color: #f0f0f0;
}

.error-message {
  color: #ff5252;
  font-size: 14;
  text-align: center;
  margin-top: 10;
}
</style>