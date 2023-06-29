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
    <v-card class="mx-auto px-10 py-8" width="70%" height="700px" v-show="this.$store.state.permission == 'Admin'">
      <br/>
      <v-virtual-scroll :items="allReq" height="600px" item-height="50px">
        <template v-slot:default="{ item }">
          <v-list-item>
            <v-list-item-title><b>{{ item.userID }}</b> wants to join trip: {{ item.tripName }}</v-list-item-title>
            <template v-slot:append>
              <v-btn size="small" variant="tonal" @click="updateStatus('joined', item)">
                <v-icon color="orange-darken-4" > mdi-check  </v-icon>&nbsp;
                  Accept
              </v-btn>
              &nbsp;
              <v-btn size="small" variant="tonal" @click="updateStatus('rejected', item)">
                <v-icon color="orange-darken-4" > mdi-close </v-icon>&nbsp;
                Reject
              </v-btn>
            </template>
            <br/>
            <v-divider></v-divider>
            <br/>
          </v-list-item>
        </template>
      </v-virtual-scroll>
    </v-card>

    <v-card class="mx-auto px-10 py-8" width="70%" height="700px" v-show="this.$store.state.permission == 'user'">
      <br/>
      <v-virtual-scroll :items="allNotify" height="600px" item-height="50px">
        <template v-slot:default="{ item }">
          <v-list-item>
            <v-list-item-title>{{item.msg}}</v-list-item-title>
            <template v-slot:append>
              <v-btn size="small" variant="tonal" @click="openTrip(item.tripID)">
                <v-icon color="orange-darken-4" > mdi-open-in-new  </v-icon>&nbsp;
                  view
              </v-btn>
            </template>
            <br/>
            <v-divider></v-divider>
            <br/>
          </v-list-item>
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
import JoinTripsService from '@/services/JoinTripsService'
import NotificationsService from '@/services/NotificationsService'
import router from '../router'

  export default {
    data: () => ({
      trips: null,
      refreshAllTrips: false,
      loadingOverlay: false,
      editOverlay: false,
      diableOverlay:true,

      allReq: [],
      addReqAry: [],
      showReq: [],
      lochtlOverlay: false,
      loadingMSG: "Loading...",
      notifyMSG: "",
      userID: "",
      allNotify: [],
    }),

    methods: {
      async getRequestedTrips(){
        this.loadingOverlay = true
        await JoinTripsService.getAllRequestedTrips().then((response)=>{
            response.data.forEach(element => {
              this.allReq.push(element)
            });
            this.loadingOverlay = false
        })
      },
      async updateStatus(status,item){
        console.log(status + "::" + item.id)
        this.loadingOverlay = true
        this.loadingMSG = "Updating..."
        var uptLoc = await JoinTripsService.updateStatus(item.id, {
          status: status
        }).then(() => {
          this.addNotifycation(item, status)
          this.loadingOverlay = false
          this.refreshAllTrips = !this.refreshAllTrips
        })
        console.log("updated: "+ uptLoc)
      },
      async getNotifications(){
        this.loadingOverlay = true
        await NotificationsService.getAllNotifications(this.userID).then((response)=>{
            response.data.forEach(element => {
              var notiMSG = "";
              if(element.action == "join"){
                notiMSG = "Your request to join trip - " + element.tripName + " has been APPROVED"
              }
              else if(element.action == "change"){
                notiMSG = "Trip details for " + element.tripName + " has been UPDATED"
              }
              else if(element.action == "reject"){
                notiMSG = "Your request to join trip - " + element.tripName + " has been REJECTED"
              }
              this.allNotify.push({
                id: element.id,
                userID: element.userID,
                tripID: element.tripID,
                tripName: element.tripName,
                action: element.action,
                msg: notiMSG
              })
            });
            this.loadingOverlay = false
        })
      },
      openTrip(tripid){
        this.$store.commit('setviewTripId', tripid)
        router.push("/viewtrip")
      },
      async addNotifycation(item, actionMSG){
        console.log("Join trip")
        var action = ""
        if(actionMSG == "joined"){
          action = "join"
        }
        else if(actionMSG == "rejected"){
          action = "reject"
        }
        await NotificationsService.addNotifications({
          userID: item.userID,
          tripID: item.tripID,
          tripName: item.tripName,
          action: action
        }).then((response)=>{
          console.log(response)
        })
      }
    },
    beforeMount() {
      this.loadingOverlay = true
      if(this.$store.state.permission == 'Admin'){
        this.getRequestedTrips()
      }
      else if(this.$store.state.permission == 'user'){
        console.log(this.$store.state.permission)
        this.loadingOverlay = false
        this.userID = this.$store.state.username
        this.getNotifications()
      }
    },
    watch: {
      refreshAllTrips: function(){
        this.loadingOverlay = true
        this.allReq = []
        this.allNotify = []
        if(this.$store.state.permission == 'Admin'){
          this.getRequestedTrips()
        }
        else if(this.$store.state.permission == 'user'){
          this.getNotifications()
        }
      }
    }
  }
</script>
