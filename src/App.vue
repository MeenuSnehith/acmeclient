<template>
  <v-app>
    <v-main>
      <NavBar :key="this.$store.state.isUserLoggedIn"/>
      <br/>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  components: { NavBar },
  name: 'App',
  data: () => ({
    //
  }),
}
</script>
