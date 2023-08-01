<template>
  <v-card height="93%">
    <v-tabs
      v-model="tab"
      color="deep-purple-accent-4"
      align-tabs="start"
    >
      <v-tab :value="1" v-show="!this.$store.state.isUserLoggedIn">Login</v-tab>
      <v-tab :value="2" v-show="this.$store.state.permission == '1' || this.$store.state.permission == '2'">Add Delivery</v-tab>
      <v-tab :value="3" v-show="this.$store.state.permission == '1'">Users</v-tab>
      <v-tab :value="4" v-show="this.$store.state.isUserLoggedIn">Deliverys</v-tab>
      <v-tab :value="5" v-show="this.$store.state.permission == '1' || this.$store.state.permission == '2'"> Customers</v-tab>
      <v-tab :value="6" v-show="this.$store.state.permission == '3'"> My Deliverys</v-tab>
      <v-tab :value="7" v-show="this.$store.state.permission == '3'"> My Dashboard</v-tab>
      <v-tab :value="8" v-show="this.$store.state.permission == '1'">Config</v-tab>
      <v-tab :value="9" v-show="this.$store.state.permission == '1'">Customer Invoice</v-tab>
      <v-tab :value="10" v-show="this.$store.state.permission == '1'">Courier Report</v-tab>
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
        <AddDelivery/>
      </v-window-item>
      <v-window-item
        :key="3"
        :value="3"
      >
        <AllUsers/>
      </v-window-item>

      <v-window-item
        :key="4"
        :value="4"
      >
        <AllDeliverys/>
      </v-window-item>
      <v-window-item
        :key="5"
        :value="5"
      >
        <AllCustomers/>
      </v-window-item>
      <v-window-item
        :key="6"
        :value="6"
      >
        <MyDeliverys/>
      </v-window-item>
      <v-window-item
        :key="7"
        :value="7"
      >
        <MyProfile/>
      </v-window-item>

      <v-window-item
        :key="8"
        :value="8"
      >
        <AddConfig/>
      </v-window-item>
      <v-window-item
        :key="9"
        :value="9"
      >
        <CustomersReport/>
      </v-window-item>
      <v-window-item
        :key="10"
        :value="10"
      >
        <CourierReport/>
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
import MyDeliverys from './MyDeliverys.vue'
import MyProfile from './MyProfile.vue'
import AddConfig from './AddConfig.vue'
import CustomersReport from './CustomersReport.vue'
import CourierReport from './CourierReport.vue'

  export default {
    components: { AllCustomers, AllDeliverys, RedirectToLoginPage, AddDelivery, AllUsers, MyDeliverys
    , MyProfile, AddConfig, CustomersReport, CourierReport},
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
        this.tab = 2
      }
      else if(this.$store.state.permission == '3'){
        this.tab = 4
      }
    }
  }
</script>
