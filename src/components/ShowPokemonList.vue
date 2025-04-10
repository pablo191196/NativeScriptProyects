<template>
    <Page class="bg-amber-200" actionBarHidden="true">
        <GridLayout rows="auto, auto, *" class="p-4">
            <Label row="0" text="Resultados de Búsqueda" class="text-center text-2xl font-bold text-amber-800 mb-2" />
            <Button row="1" text="Volver" @tap="$navigateBack" class="bg-amber-600 text-white font-semibold rounded-lg py-2 mb-4 w-1/3 self-center" />
            
            <ListView row="2" v-if="pokemones.length > 0" :items="pokemones" class="list">
                <template #default="{ item }">
                    <StackLayout class="m-2 p-4 bg-white rounded-xl border-2 border-amber-200 elevation-2">
                        <GridLayout columns="auto, *" rows="auto, auto" class="w-full">
                            <Image col="0" rowSpan="2" :src="item.sprites.front_default" 
                                class="w-20 h-20 rounded-full bg-amber-100 border-2 border-amber-300" 
                                 />
                            
                            <Label col="1" row="0" :text="capitalizeFirstLetter(item.name)" 
                                class="font-bold text-lg text-amber-800 ml-2" />
                            
                            <StackLayout col="1" row="1" class="ml-2">
                                <Label :text="'#' + item.id" class="text-amber-600 font-medium" />
                                <Label :text="'Peso: ' + item.weight/10 + ' kg'" class="text-gray-600" />
                            </StackLayout>
                        </GridLayout>
                    </StackLayout>
                </template>
            </ListView>
            <Label row="2" v-else text="No hay resultados para mostrar..." class="text-center text-gray-500 italic mt-4" />
        </GridLayout>
    </Page>
</template>

<script lang="ts" setup>
import PokeService from '../services/PokeService.service';
import { ref, computed } from 'nativescript-vue';
import { $navigateBack } from 'nativescript-vue';
import { usePokemonStore } from '../store/pokemonStore';

const store = usePokemonStore();
const pokemones = computed(() => store.resultados);

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
</script>

