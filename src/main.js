import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router'
import { createStore } from 'vuex'

loadFonts()

const store = createStore({
  state () {
    return {
      username: "",
      permission: "",
      isUserLoggedIn: false,
      viewTripId: "",
      editTripId: ""
    }
  },
  mutations: {
    setUserName (state, username){
      state.username = username
    },
    setPermission (state, permission){
      state.permission = permission
    },
    setIsUserLoggedIn (state, isUserLoggedIn){
      state.isUserLoggedIn = isUserLoggedIn
    },
    setviewTripId (state, id){
      state.viewTripId = id
    },
    seteditTripId (state, id){
      state.editTripId = id
    }
  }
})

createApp(App)
  .use(vuetify)
  .use(router)
  .use(store)
  .mount('#app')

  