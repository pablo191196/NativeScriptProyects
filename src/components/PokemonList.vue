<template>
  <Page>
    <ActionBar hidden />
    <ListView v-if="pokemones.length > 0" :items="pokemones" class="list">
      <template #default="{ item }">
        <StackLayout class=" m-2 p-2 bg-black rounded border border-gray-700 elevation-2">
          <Label :text="item.name" class="font-bold text-lg" />
          <Image
            :src="item.sprites.front_default"
            class="w-100 h-100 rounded-full"
            stretch="aspectFill"/>

        </StackLayout>
      </template>
    </ListView>
    <Label v-else text="Cargando pokemones..." />
  </Page>
</template>

<script setup lang="ts">

import { computed } from 'nativescript-vue';
import { usePokemonStore } from '../store/pokemonStore';
import { Image } from '@nativescript/core';

const store = usePokemonStore();
const pokemones = computed(() => store.resultados);
console.log('Pokemones en lista:', pokemones.value);
console.log('Nmbre del pokemon:', pokemones.value[0]?.name); 
</script>
