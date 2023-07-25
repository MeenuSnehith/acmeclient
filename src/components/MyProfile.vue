<template>
  <div :key="trips">
    <v-row class="text-right"> 
      <v-col col="12" mb="2">
        <v-btn
          prepend-icon="mdi-account-circle"
          @click="refreshAllTrips = !refreshAllTrips"
        >
          <template v-slot:prepend>
            <v-icon color="primary">mdi-refresh</v-icon>
          </template>
            Refresh
          </v-btn>
      </v-col>
    </v-row>
    <br/>
    <v-card class="mx-auto px-10 py-8" width="90%" height="200">
      <v-row>
        <v-col>
          <p><b>User Name: </b> {{ username }}</p>
          <p><b>Number of Deliveries:</b> {{ deliveryCount }}</p>
          <p><b>Number of Completed Deliveries:</b> {{ completedCount }}</p>
          <p><b>Number of Bonus from Delivery:</b> {{ bonusCount }}</p>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="mx-auto px-10 py-8" width="90%" height="600">
          <br/>
          <h2>Deliveries</h2>
          <v-virtual-scroll :items="deliverys" height="600" item-height="50">
            <template v-slot:default="{ item }">
              <v-list-item>
                <v-list-item-title>Delivery ID: {{ item.id }}</v-list-item-title>
                <v-list-item-subtitle> {{ item.pickupCustomerName }} to {{ item.deliveryCustomerName }}</v-list-item-subtitle>
                <v-list-item-subtitle>Pick Up: {{ item.pickupStreet }} - {{ item.pickupAvn }} &nbsp; Delivery: {{ item.deliveryStreet }} - {{ item.deliveryAvn }}</v-list-item-subtitle>
                <template v-slot:append>
                  <v-icon color="yellow-darken-4" v-show="item.isBonus == 'yes'"> mdi-star </v-icon>&nbsp;&nbsp;
                  <v-icon color="green-darken-4" v-show="item.status == 4"> mdi-check-circle </v-icon>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <v-btn size="small" variant="tonal" @click="openDelivery(item.id)">
                    <v-icon color="orange-darken-4" end> mdi-open-in-new </v-icon>&nbsp;
                    View
                  </v-btn>
                </template>
              </v-list-item>
              <v-divider></v-divider>
            </template>
          </v-virtual-scroll>
        </v-card>
   
    <v-overlay
      :model-value="loadingOverlay"
      class="align-center justify-center"
      :persistent="diableOverlay"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
      <h3>{{loadingMSG}}</h3>
    </v-overlay>
  </div>
</template>

<script>
import DeliveryService from '@/services/DeliveryService'
import router from '../router'

  export default {
    data: () => ({
      trips: null,
      refreshAllTrips: false,
      loadingOverlay: false,
      editOverlay: false,
      diableOverlay:true,

      lochtlOverlay: false,
      loadingMSG: "Loading...",
      username: "",

      deliverys: [],
      deliveryCount: 0,
      bonusCount: 0,
      completedCount: 0
    }),

    methods: {
      async getAllDeliverys(){
        await DeliveryService.getlDeliverysByUser(this.username).then((response)=>{
            response.data.forEach(element => {
              this.deliverys.push(element)
              this.deliveryCount = this.deliveryCount + 1
              if(element.isBonus == 'yes'){
                this.bonusCount = this.bonusCount + 1
              }
              if(element.status == 4){
                this.completedCount = this.completedCount + 1
              }
            });
            this.loadingOverlay = false
        })
      },
      openDelivery(id){
        this.$store.commit('setviewDeliveryId', id)
        router.push("/viewdelivery")
      }
    },
    beforeMount() {
      this.loadingOverlay = true
      this.username = this.$store.state.username
      this.getAllDeliverys()
    },
    watch: {
      refreshAllTrips: function(){
        this.loadingOverlay = true
        this.deliverys = []
        this.getAllDeliverys()
      }
    }
  }
</script>
