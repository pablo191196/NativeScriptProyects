<script lang="ts" setup>
import { $navigateBack } from 'nativescript-vue';
defineProps(['pokemon']);
</script>

<template>
        <Page>
            <GridLayout rows="auto, *" class="px-4">
            <Label row="0" :text="pokemon.name" class="text-center text-2xl font-bold" />
            <Button row="1" text="Volver" @tap="$navigateBack" />
            </GridLayout>
        </Page>
</template>