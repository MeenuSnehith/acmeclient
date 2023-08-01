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
    <v-card class="mx-auto px-10 py-8" width="90%" height="600">
          <br/>
          <v-virtual-scroll :items="deliverys" height="600" item-height="50">
            <template v-slot:default="{ item }">
              <v-list-item>
                <v-list-item-title>Delivery ID: {{ item.id }}</v-list-item-title>
                <v-list-item-subtitle> {{ item.pickupCustomerName }} to {{ item.deliveryCustomerName }}</v-list-item-subtitle>
                <v-list-item-subtitle>Pick Up: {{ item.pickupStreet }} - {{ item.pickupAvn }} &nbsp; Delivery: {{ item.deliveryStreet }} - {{ item.deliveryAvn }}</v-list-item-subtitle>
                <template v-slot:append>
                  <v-icon color="red-darken-4" v-show="item.status == 1"> mdi-clipboard-text </v-icon>
                    <v-icon color="yellow-darken-4" v-show="item.status == 2"> mdi-clipboard-check </v-icon>
                    <v-icon color="blue-darken-4" v-show="item.status == 3"> mdi-truck-delivery </v-icon>
                    <v-icon color="green-darken-4" v-show="item.status == 4"> mdi-check-circle </v-icon>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <v-btn size="small" variant="tonal" @click="openDelivery(item.id)">
                    <v-icon color="orange-darken-4" end> mdi-open-in-new  </v-icon> &nbsp;
                    View
                  </v-btn>
                  &nbsp;
                  <v-btn size="small" variant="tonal" @click="editDelivery(item.id)" v-show="this.$store.state.permission != '3'">
                    <v-icon color="orange-darken-4" end> mdi-pencil </v-icon>&nbsp;
                    Edit
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
      userPerms: "",

      deliverys: []
    }),

    methods: {
      async getAllDeliverys(){
        console.log("Get deliveries.")
        await DeliveryService.getAllDeliverys().then((response)=>{
            response.data.forEach(element => {
              if(this.userPerms == "3"){
                if(element.orderTakenBy == "" || element.orderTakenBy == null){
                  this.deliverys.push(element)
                }
              }else{
                this.deliverys.push(element)
              }
            });
            this.loadingOverlay = false
        })
      },
      },
      editDelivery(id){
        console.log(id)
        this.$store.commit('seteditDeliveryId', id)
        router.push("/updatedelivery")
      }
    },
    beforeMount() {
      this.loadingOverlay = true
      this.deliverys = []
      this.userPerms = this.$store.state.permission
      this.getAllDeliverys()
    },
    watch: {
      refreshAllTrips: function(){
        this.loadingOverlay = true
        this.deliverys = []
        this.userPerms = this.$store.state.permission
        this.getAllDeliverys()
      }
    }
  }
</script>
