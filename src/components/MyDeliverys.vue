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
  
  <div class="d-flex align-center flex-column"  v-for="trip in trips" v-bind:key="trip">
    <br/>
    <v-card width="60%">
      <v-img
        :src="trip.thumbnailURL"
        height="200px"
        cover
      ></v-img>
      <v-card-item>
        <v-card-title>{{trip.tripTitle}}</v-card-title>

        <v-card-subtitle>Location: {{trip.location}}</v-card-subtitle>
      </v-card-item>

      <v-card-text>
        {{trip.description}}
        <p>
          Days: {{trip.days}} --- Nights: {{trip.nights}} ---- from: {{trip.fromdate}} - to: {{trip.todate}}
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn class="ms-2" variant="outlined" size="small" @click="openTrip(trip.id)">
          View Trip
        </v-btn>
      </v-card-actions>
    </v-card>
    <br/>
  </div>
  </div>
</template>

<script>
import TripsService from '@/services/TripsService'
import router from '../router'
import JoinTripsService from '@/services/JoinTripsService'

  export default {
    data: () => ({
      trips: [],
      refreshAllTrips: false
    }),

    methods: {
      GetJoinedTripDetails(){
        this.GetJoinedTrips()
        this.trips.forEach(element => {
            console.log("trips : " + element)
          })
      },
      async GetJoinedTrips(){
        await JoinTripsService.getAllJoinedTrips({
          userID: this.$store.state.username
        }).then((response)=>{
          response.data.forEach(element => {
            this.GetAllTrips(element)
          })
          
        })
        console.log(this.trips)
      },
      async GetAllTrips(joinedTrip){
        if(joinedTrip.tripID != ""){
          await TripsService.getAllJoinedTrips({
            id: joinedTrip.tripID,
            status: "joined"
          }).then((response)=>{
            console.log(response.data[0])
            this.trips.push({
              id: response.data[0].id,
              tripTitle: response.data[0].tripTitle != "" ? response.data[0].tripTitle: "",
              location: response.data[0].location != "" ? response.data[0].location: "",
              days: response.data[0].days != "" ? response.data[0].days: "",
              nights: response.data[0].nights != "" ? response.data[0].nights: "",
              costperperson: response.data[0].costperperson != "" ? response.data[0].costperperson: "",
              fromdate: response.data[0].fromdate != "" ? response.data[0].fromdate: "",
              todate: response.data[0].todate != "" ? response.data[0].todate: "",
              description: response.data[0].description != "" ? response.data[0].description: "",
              thumbnailURL: response.data[0].thumbnailURL != "" ? response.data[0].thumbnailURL: "",
            })
          })
        }
      },
      openTrip(tripid){
        this.$store.commit('setviewTripId', tripid)
        router.push("/viewtrip")
      }
    },
    beforeMount() {
      this.GetJoinedTripDetails()
    },
    watch: {
        refreshAllTrips: function(){
          this.trips = []
        console.log(this.refreshAllTrips)
        this.GetJoinedTripDetails()
      }
    }
  }
</script>
