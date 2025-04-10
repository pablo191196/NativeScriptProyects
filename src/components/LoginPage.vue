<script lang="ts" setup>
  import { ref,$navigateTo, $navigateBack } from 'nativescript-vue';
  import Home from './Home.vue';
  import Register from './Register.vue';
  import { useLoginStore } from '../store/LoginStore';
  
  const username = ref('');
  const password = ref('');
  const store = useLoginStore()

  
  function login() {
    if (store.login(username.value, password.value)) {
      console.log('Usuario autenticado:', username.value);
      goToHome;
    } else {
      console.log(store.getAuthError)
    }
  }
  
  const goToRegister= ()=> {
    $navigateTo(Register);
  }

  const goToHome= ()=> {
    $navigateTo(Home);
  }
</script>

<template>
  <Page actionBarHidden="true">
    <StackLayout class="px-6 py-12 space-y-4 bg-white">
      
      <Label text="Iniciar sesión" class="text-2xl font-bold text-center text-gray-800" />

      <TextField
        v-model="username"
        hint="Usuario"
        class="border border-gray-300 rounded-md px-4 py-2 text-base"
      />
      <TextField
        v-model="password"
        hint="Contraseña"
        secure="true"
        class="border border-gray-300 rounded-md px-4 py-2 text-base"
      />

      <Button
        text="Entrar"
        class="bg-sky-500 text-white py-2 rounded-md mt-2"
        @tap="login"
      />

      <FlexboxLayout class="flex-row justify-center mt-4 space-x-1">
        <Label text="¿No tenés cuenta?" class="text-gray-700" />
        <Button
          text="Registrate"
          class="text-sky-500 font-bold"
          @tap="goToRegister"
        />
      </FlexboxLayout>

    </StackLayout>
  </Page>
</template>

  
