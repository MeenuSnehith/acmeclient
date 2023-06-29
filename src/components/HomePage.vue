<template>
  <v-card height="93%">
    <v-tabs
      v-model="tab"
      color="deep-purple-accent-4"
      align-tabs="start"
    >
      <v-tab :value="1" v-show="!this.$store.state.isUserLoggedIn">Login</v-tab>
      <v-tab :value="2" v-show="this.$store.state.permission == '1'">Users</v-tab>
      <v-tab :value="3" v-show="this.$store.state.isUserLoggedIn">All Deliverys</v-tab>
      <v-tab :value="4" v-show="this.$store.state.permission == '1' || this.$store.state.permission == '2'">Add Delivery</v-tab>
      <v-tab :value="5" v-show="this.$store.state.permission == '1' || this.$store.state.permission == '2'">All Customers</v-tab>
    </v-tabs>
    <v-window v-model="tab"> 
      <v-window-item
        :key="1"
        :value="1"
      >
        <RedirectToLoginPage/>
      </v-window-item>

      <v-window-item
        :key="2"
        :value="2"
      >
        <AllUsers/>
      </v-window-item>

      <v-window-item
        :key="3"
        :value="3"
      >
        <AllDeliverys/>
      </v-window-item>
      <v-window-item
        :key="4"
        :value="4"
      >
        <AddDelivery/>
      </v-window-item>
      <v-window-item
        :key="5"
        :value="5"
      >
        <AllCustomers/>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script>
import RedirectToLoginPage from './RedirectToLoginPage.vue'
import AllUsers from './AllUsers.vue'
import AllDeliverys from './AllDeliverys.vue'
import AddDelivery from './AddDelivery.vue'
import AllCustomers from './AllCustomers.vue'

  export default {
    components: { AllCustomers, AllDeliverys, RedirectToLoginPage, AddDelivery, AllUsers},
    data: () => ({
      tab: null,
    }),

    methods: {
      
    },
    beforeMount() {
      console.log("home start...")
      if(this.$store.state.permission == '1'){
        this.tab = 2
      }
      else if(this.$store.state.permission == '2'){
        this.tab = 3
      }
    }
  }
</script>
