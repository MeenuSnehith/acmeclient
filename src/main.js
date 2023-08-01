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
      viewDeliveryId: "",
      editDeliveryId: ""
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
    setviewDeliveryId (state, id){
      state.viewDeliveryId = id
    },
    seteditDeliveryId (state, id){
      state.editDeliveryId = id
    }
  }
})

createApp(App)
  .use(vuetify)
  .use(router)
  .use(store)
  .mount('#app')

  