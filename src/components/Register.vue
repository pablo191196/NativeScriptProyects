
<script lang="ts" setup>
import { $navigateTo, computed, ref } from 'nativescript-vue'
import LoginPage from './LoginPage.vue'
import  {useLoginStore}  from '../store/LoginStore'
import User from '../interfaces/User.interface'
const username = ref('')
const email = ref('')
const password = ref('')
const store = useLoginStore()

function register() {
  const user:User={
    username: username.value,
    email: email.value,
    password: password.value
  }
  

  
  if (store.registerUser(user)) {
    console.log('Usuario registrado:', user,'Volviendo a la pantalla de login')
    $navigateTo(LoginPage)
  } else {
    console.log('Usuario ya registrado con estas credenciales')
  }
    
}

function goToLogin() {
  console.log('Ir a la pantalla de login')
  $navigateTo(LoginPage)
}
</script>

  <template>
    <Page actionBarHidden="true">
      <StackLayout class="p-6 space-y-4">
        <Label text="Registro" class="text-2xl font-bold text-center mb-4 text-sky-600" />
  
        <!-- Nombre de usuario -->
        <TextField
          v-model="username"
          hint="Nombre de usuario"
          class="border border-gray-300 rounded-md px-4 py-2 text-base"
        />
  
        <!-- Correo electrónico -->
        <TextField
          v-model="email"
          hint="Correo electrónico"
          keyboardType="email"
          class="border border-gray-300 rounded-md px-4 py-2 text-base"
        />
  
        <!-- Contraseña -->
        <TextField
          v-model="password"
          hint="Contraseña"
          secure="true"
          class="border border-gray-300 rounded-md px-4 py-2 text-base"
        />
  
        <!-- Botón de registrarse -->
        <Button
          text="Registrarse"
          class="bg-sky-500 text-white py-2 rounded-md"
          @tap="register"
        />
  
        <!-- Enlace a login -->
        <FlexboxLayout class="flex-row justify-center mt-4 space-x-1">
          <Label text="¿Ya tenés cuenta?" class="text-gray-600" />
          <Button text="Iniciar sesión" class="text-sky-500 font-bold" @tap="goToLogin" />
        </FlexboxLayout>
      </StackLayout>
    </Page>
  </template>