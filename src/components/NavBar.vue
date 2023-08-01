<template>
  <v-container>
    <div>
    <v-app-bar
        color="primary"
        density="compact"
      >
       
        <v-app-bar-title>Welcome to Courier Portal</v-app-bar-title>

        <template v-slot:prepend>
          <v-btn
            color="white"
            icon="mdi-home"
            variant="text"
            to="/"
          ></v-btn>
        </template>
        <template v-slot:append>
          <div class="text-center" v-show="isUserLoggedIn">
            <v-btn
              prepend-icon="mdi-account-circle"
            >
              <template v-slot:prepend>
                <v-icon color="warning"></v-icon>
              </template>
              {{UserName}}
            </v-btn>
            <v-btn
              prepend-icon="mdi-logout"
              @click="logout"
            >
              <template v-slot:prepend>
                <v-icon color="warning"></v-icon>
              </template>
              Log out
            </v-btn>
          </div>
        </template>
      </v-app-bar>
      </div>
  </v-container>
</template>

<script>
import { useStore } from 'vuex'
import router from '../router'

export default {
  name: 'NavBar',

  data: () => ({
    showLoginBtn: true,
    UserName: "",
    isUserLoggedIn: false
  }),

  methods: {
      onLoad(){
        const store = useStore()
        console.log(store.state.isUserLoggedIn)
        console.log(store.state.username)
        this.isUserLoggedIn = store.state.isUserLoggedIn
        this.UserName = store.state.username
      },
      logout(){
        this.UserName = ""
        this.isUserLoggedIn = false
        this.$store.commit('setUserName', "")
        this.$store.commit('setPermission', "")
        this.$store.commit('setIsUserLoggedIn', false)
        router.push("/login")

      }
  },
  beforeMount() {
    this.onLoad()
  },

}
</script>
