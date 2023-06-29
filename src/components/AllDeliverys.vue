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
                  <v-btn size="small" variant="tonal">
                    <v-icon color="orange-darken-4" end> mdi-pencil  </v-icon>&nbsp;
                    View
                  </v-btn>
                  &nbsp;
                  <v-btn size="small" variant="tonal">
                    <v-icon color="orange-darken-4" end> mdi-delete-empty </v-icon>&nbsp;
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
import ItinerarysService from '@/services/ItinerarysService'
import DeliveryService from '@/services/DeliveryService'

  export default {
    data: () => ({
      trips: null,
      refreshAllTrips: false,
      loadingOverlay: false,
      editOverlay: false,
      diableOverlay:true,

      createHtlIMG: "",
      createHtl: "",
      editHtlIMG: "",
      editHtl: "",
      editHtlID: "",
      allHtl: [],
      addHtlAry: [],
      showHtl: [],
      lochtlOverlay: false,
      loadingMSG: "Loading...",

      deliverys: []
    }),

    methods: {
      async getAllDeliverys(){
        await DeliveryService.getAllDeliverys().then((response)=>{
            response.data.forEach(element => {
              this.deliverys.push(element)
            });
            this.loadingOverlay = false
        })
      },
      async createHotel(){
        if(this.createHtl != "" && this.createHtlIMG != null){
        this.loadingOverlay = true
          await ItinerarysService.addHotel({
            HotelName: this.createHtl,
            ImageURL: this.createHtlIMG
          }).then((response)=>{
            console.log("create Location: " + response)
            this.allHtl.push({
              "id" : response.data.id,
              "HotelName" : response.data.HotelName,
              "ImageURL" : response.data.ImageURL
            })
            
            this.addHtlAry.push({
              "HotelName" : this.createHtl,
              "ImageURL" : this.createHtlIMG
            })
            this.createHtl = ""
            this.createHtlIMG = ""
            
            this.loadingOverlay = false
          })
        }
          else{
            this.showSnackles("Please Fill hotel name and Hoptel image URL to continue.")
          }
      },
      editHotel(hot){
        console.log(hot)
        this.editHtl = hot.HotelName
        this.editHtlIMG = hot.ImageURL
        this.editHtlID = hot.id
        this.editOverlay = !this.editOverlay
      },
      async deleteHotel(hot){
        console.log(hot)
        this.loadingOverlay = true
        this.loadingMSG = "Deleting..."
        var deleteHot = await ItinerarysService.deleteHotel(hot.id).then(()=> {
          this.loadingOverlay = false
          this.refreshAllTrips = !this.refreshAllTrips
        })
        console.log(deleteHot)
      },
      async updateHtl(){
        console.log(this.editHtlID)
        this.loadingOverlay = true
        this.loadingMSG = "Updating..."
        var uptHtl = await ItinerarysService.updateHotel(this.editHtlID, {
          HotelName: this.editHtl,
          ImageURL: this.editHtlIMG
        }).then(() => {
          this.editOverlay = !this.editOverlay
          this.loadingOverlay = false
          this.refreshAllTrips = !this.refreshAllTrips
        })
        console.log("updated: "+ uptHtl)
      }
    },
    beforeMount() {
      this.loadingOverlay = true
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
