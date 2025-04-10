<script lang="ts" setup>
import { $navigateTo } from 'nativescript-vue';
import LoginPage from './LoginPage.vue';
import SearchPokemonByName from './SearchPokemonByName.vue';
import SearchPokemonByType from './SearchPokemonByType.vue';
import { ref, onMounted } from 'nativescript-vue';
import { GradientAnimation } from '../utils/rgbAnimation';

// Animation state variables
const titleAnimated = ref(false);
const buttonsAnimated = ref(false);
const pokemonAnimated = ref(false);

function goToLogin() {
  $navigateTo(LoginPage);
}
function goToSearchByName() {
  $navigateTo(SearchPokemonByName);
}
function goToSearchByType() {
  $navigateTo(SearchPokemonByType);
}

// Start animations when component is mounted
onMounted(() => {
  console.log("Component mounted");
  
  // Animate title immediately
  titleAnimated.value = true;
  
  // Animate buttons after a short delay
  setTimeout(() => {
    buttonsAnimated.value = true;
  }, 500);
  
  // Animate Pokémon after a longer delay
  setTimeout(() => {
    pokemonAnimated.value = true;
  }, 1000);
});
</script>

<template>
  <Frame>
    <Page actionBarHidden="true" @loaded="GradientAnimation.onPageLoaded" @unloaded="GradientAnimation.onPageUnloaded">
      <ScrollView>
        <RootLayout>
          <!-- Fondo animado usando id y de manera programatica -->
          <ContentView id="gradientBackground" />
        <StackLayout class="p-4">
          <StackLayout :class="{ 'title-animation': titleAnimated }" class="text-center p-4 m-4">
            <Label text="Pokédex" class="text-5xl font-bold text-yellow-400" />
            <Label text="Bienvenido a la App de Pokémon" class="text-xl text-white mt-2" />
            
            <Image src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" 
                   class="h-32 w-32 mt-4" stretch="aspectFit" />
          </StackLayout>
          
          <StackLayout :class="{ 'buttons-animation': buttonsAnimated }" class="m-t-10 opacity-0">
            <Label text="Opciones de Búsqueda" class="text-center text-xl text-white mb-4" />
            
            <Button text="Buscar Pokémon por Nombre" @tap="goToSearchByName" 
                    class="bg-red-500 text-white font-bold p-4 rounded-lg m-2" />
            
            <Button text="Mostrar lista de Pokémon" @tap="goToSearchByType" 
                    class="bg-blue-500 text-white font-bold p-4 rounded-lg m-2" />
            
            <Button text="Iniciar Sesión" @tap="goToLogin" 
                    class="bg-green-500 text-white font-bold p-4 rounded-lg m-2" />
          </StackLayout>
          
          <GridLayout :class="{ 'pokemon-animation': pokemonAnimated }" rows="auto, auto" columns="*, *" class="mt-8 text-center opacity-0">
            <StackLayout row="0" col="0" class="p-2">
              <Image src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" 
                     class="h-24 w-24" stretch="aspectFit" />
              <Label text="Charmander" class="text-white" />
            </StackLayout>
            
            <StackLayout row="0" col="1" class="p-2">
              <Image src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" 
                     class="h-24 w-24" stretch="aspectFit" />
              <Label text="Squirtle" class="text-white" />
            </StackLayout>
            
            <StackLayout row="1" col="0" class="p-2">
              <Image src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" 
                     class="h-24 w-24" stretch="aspectFit" />
              <Label text="Bulbasaur" class="text-white" />
            </StackLayout>
            
            <StackLayout row="1" col="1" class="p-2">
              <Image src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" 
                     class="h-24 w-24" stretch="aspectFit" />
              <Label text="Pikachu" class="text-white" />
            </StackLayout>
          </GridLayout>
          
          <Label text="Pokémon App 2025" class="text-center text-white mt-8 opacity-70" />
        </StackLayout>
        </RootLayout>
      </ScrollView>
    </Page>
  </Frame>
</template>

<style>
/* CSS Animations for NativeScript */
.title-animation {
  animation-name: pulse;
  animation-duration: 5s;
  animation-iteration-count: 1;
  animation-direction: alternate;
}

.buttons-animation {
  animation-name: fadeIn;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

.pokemon-animation {
  animation-name: slideUp;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}


.title {
  text-align: center;
  margin-top: 40px;
  font-size: 24px;
  color: white;
  font-weight: bold;
}

@keyframes pulse {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(50); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

</style>