<template>
  <v-sheet :key="refreshPage">
    <v-card class="mx-auto px-10 py-8" max-width="85%">
      <v-row v-show="status == 4">
        <v-col>
          <v-alert
            type="success"
            title="Delivery Completed"
            :text="alertMsg"
          ></v-alert>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          
          <v-card>
            <v-card-title class="text-h6">
              Package ID: {{deliveryID}}
            </v-card-title>
            <v-card-actions>
              <v-btn
                color="teal-accent-4"
                variant="elevated"
                rounded="xl"
                v-show="this.$store.state.isUserLoggedIn && this.$store.state.permission == '3' && orderTakenBy==null"
                @click="assignDelivery"
              >
                Assign to me
              </v-btn>
              <v-btn
                color="teal-accent-4"
                variant="elevated"
                rounded="xl"
                disabled
                v-show="this.$store.state.isUserLoggedIn && orderTakenBy != null"
              >
                Assigned to {{orderTakenBy}}
              </v-btn>
              <v-btn
                color="teal-accent-4"
                variant="elevated"
                rounded="xl"
                disabled
                v-show="(!this.$store.state.isUserLoggedIn || this.$store.state.permission != '3') &&  orderTakenBy == null"
              >
                Unassign
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <br/>
      
      <v-row>
        <v-col
          cols="6"
        >
          <h3>Pickup Customer Details: </h3>
          <p>Name - {{pickUpCust}}</p>
          <p>Street - {{pickUpStreet}}</p>
          <p>Avenue - {{pickUpAvenue}}</p>

          <br/>
          <h4>Pickup Route: </h4>
          <p>{{pickUpRoute}}</p>
          <v-text-field
              v-model="pickUpTime"
              type="datetime-local"
              label= "Pick Up Time"
              disabled
            ></v-text-field>  
        </v-col>
        <v-col
          cols="6"
        >
          <h3>Delivery Customer Details: </h3>
          <p>Name - {{deliveryCust}}</p>
          <p>Street - {{deliveryStreet}}</p>
          <p>Avenue - {{deliveryAvenue}}</p>

          <br/>
          <h4>Delivery Route: </h4>
          <p>{{deliveryRoute}}</p>
          <v-text-field
              v-model="deliveryTime"
              type="datetime-local"
              label= "Delivery Time"
              disabled
            ></v-text-field>  
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="2"
        >
          <h3>Estimasted Cost: </h3>
          <p>$ {{estimatedCost}}</p>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="mx-auto px-10 py-8" max-width="85%">
      <v-row>
        <v-col cols="4"  :key="countDownTimerView">
          <h1>{{ countDownTimerView }}</h1>
          <p>Pick Up Route</p>
          <p>Estimated Minutes for delivery : {{ estMin }}</p>
          <v-btn
            color="teal-accent-4"
            variant="elevated"
            rounded="xl"
            v-show="showStatusBtn"
            @click="updateDeliveryStatus"
          >
            {{ statusBtnMsg }}
          </v-btn>
        </v-col>
        <v-col cols="8">
          <div style="height:600px; width:800px">
            <l-map :useGlobalLeaflet="false" :zoom="zoom" :center="[0, 0]" :options="{ minZoom: 6, maxZoom: 6 }">
              <l-image-overlay :options="tileOptions"
                url="https://i.imgur.com/1LvQZmv.png"
                :bounds="[
                  [-6, -8],
                  [6, 8],
                ]"
              ></l-image-overlay>
              <l-polyline :lat-lngs="polyline.latlngs" :color="polyline.color"></l-polyline>
              <l-marker :lat-lng="markerLatLng" ></l-marker>
            </l-map>
          </div>
        </v-col>
      </v-row>
      
    </v-card>

    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
    >
      
    </v-snackbar>
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
    </v-overlay>

  </v-sheet>
  
</template>

<script>
import DeliveryService from '@/services/DeliveryService'
import "leaflet/dist/leaflet.css";
import { LMap, LImageOverlay, LPolyline, LMarker } from "@vue-leaflet/vue-leaflet";

  export default {
    components: {
      LMap,
      LImageOverlay, 
      LPolyline, 
      LMarker
    },
    data: () => ({
      loadingOverlay: false,
      diableOverlay:true,
      lochtlOverlay: false,
      username: "",
      refreshPage: false,
      alertMsg: "",

      deliveryID: "",
      orderTakenBy: "",
      pickUpCust: "",
      pickUpStreet: "",
      pickUpAvenue: "",
      deliveryCust: "",
      deliveryStreet: "",
      deliveryAvenue: "",
      pickUpRoute: "",
      deliveryRoute: "",
      pickUpTime: "",
      deliveryTime: "",
      estimatedCost: "",
      delivery: "",
      estMin: 0,
      countDown: 1,
      countDownTimerView: "",
      assignedTime: "",
      status: 0,
      statusBtnMsg: "",
      showStatusBtn: false,
      isBonus: "",
      timeElapsed: 0,
      zoom: 6,
      polyline: {
        latlngs: [],
        color: 'green'
      },
      markerLatLng: [0, 0]
    }),

    methods: {
      async GetDeliveryDetails(){
        console.log("get Delivery: " + this.deliveryID)
        await DeliveryService.getlDeliveryByID(this.deliveryID)
        .then((response)=>{
          this.delivery = response.data
          this.orderTakenBy = this.delivery.orderTakenBy
          this.pickUpCust = this.delivery.pickupCustomerName
          this.pickUpCustID = this.delivery.pickupCustomerId
          this.pickUpStreet = this.delivery.pickupStreet
          this.pickUpAvenue = this.delivery.pickupAvn
          this.deliveryCust = this.delivery.deliveryCustomerName
          this.deliveryCustID = this.delivery.deliveryCustomerId
          this.deliveryStreet = this.delivery.deliveryStreet
          this.deliveryAvenue = this.delivery.deliveryAvn
          this.pickUpRoute = this.delivery.pickupRoute
          this.deliveryRoute = this.delivery.deliveryRoute
          this.estimatedCost = this.delivery.estimatedPrice
          this.estMin = this.delivery.estMin
          this.pickUpTime = this.dateFormatter(this.delivery.pickupTime)
          this.deliveryTime = this.dateFormatter(this.delivery.deliveryTime)
          this.status = this.delivery.status
          this.assignedTime = this.delivery.assignedTime
          this.timeElapsed = this.delivery.deliveryTimeMin
          if(this.status < 3){
            this.pickUpRouting()
          }
          else if(this.status == 3){
            this.deliveryRouting()
          }

          if(this.status > 1 && this.status < 4){
            this.countDown = this.getCountDown()
            this.countDownTimer()
          }

          if(this.status == 2){
            this.statusBtnMsg = "Picked Up"
            this.showStatusBtn = true
          }
          else if(this.status == 3){
            this.statusBtnMsg = "Deliveryed"
            this.showStatusBtn = true
          }
          else{
            this.showStatusBtn = false
          }

          if(this.status == 4){
            this.alertMsg = "This Delivery is completed in : " + this.timeElapsed + " Minute(s)"
          }

          this.loadingOverlay = false
        })
        console.log(this.delivery)

      },
      getDeliveryID(){
        this.deliveryID = this.$store.state.viewDeliveryId
        this.username = this.$store.state.username
        console.log("view deliveryID: " + this.deliveryID)
      },
      async assignDelivery(){
        console.log("Assign Delivery")
        console.log(this.username)
        console.log(this.deliveryID)
        if(this.username != "" && this.deliveryID != ""){
          await DeliveryService.updateDelivery({
            orderTakenBy: this.username,
            assignedTime: new Date(),
            status: "2"
          }, this.deliveryID).then((response)=>{
            console.log(response)
            this.orderTakenBy = this.username
            this.statusBtnMsg = "Picked Up"
            this.showStatusBtn = true
            this.status = 2
          })
        }
        this.assignedTime = new Date()
        this.countDown = this.getCountDown()
        this.countDownTimer()
      },
      pickUpRouting (){
        this.polyline = {
          latlngs: [],
          color: 'green'
        }
        const pickupARY = this.pickUpRoute.split(",")
        pickupARY.forEach(element => {
          this.polyline.latlngs.push(this.mapPointsMapping(element))
        });

        this.markerLatLng = this.mapPointsMapping(pickupARY[pickupARY.length-1])
      },
      deliveryRouting (){
        this.polyline = {
          latlngs: [],
          color: 'green' 
        }
        const pickupARY = this.deliveryRoute.split(",")
        pickupARY.forEach(element => {
          this.polyline.latlngs.push(this.mapPointsMapping(element))
        });
        this.markerLatLng = this.mapPointsMapping(pickupARY[pickupARY.length-1])
      },
      dateFormatter(date){
        if(date != null){
          const tempDate = new Date(date)
          console.log(tempDate)
          const tempMin = tempDate.getMinutes() < 10 ? "0" + tempDate.getMinutes() : tempDate.getMinutes()
          const tempHour = tempDate.getHours() < 10 ? "0" + tempDate.getHours() : tempDate.getHours()
          const tempMonth = tempDate.getMonth() < 10 ? "0" + tempDate.getMonth() : tempDate.getMonth()
          const tempDay = tempDate.getDate() < 10 ? "0" + tempDate.getDate() : tempDate.getDate()
          const returnDate = tempDate.getFullYear() + "-" + tempMonth + "-" + tempDay + "T" + tempHour + ":" + tempMin
          console.log(returnDate)
          return returnDate
        }
      },
      mapPointsMapping(point){
        switch(point){
          case "A1": return [5.05, -5.77];
          case "A2": return [3.35, -5.77];
          case "A3": return [1.55, -5.77];
          case "A4": return [-0.05, -5.77];
          case "A5": return [-1.75, -5.77];
          case "A6": return [-3.45, -5.77];
          case "A7": return [-5.15, -5.77];
          case "B1": return [5.05, -3.85];
          case "B2": return [3.35, -3.85];
          case "B3": return [1.55, -3.85];
          case "B4": return [-0.05, -3.85];
          case "B5": return [-1.75, -3.85];
          case "B6": return [-3.45, -3.85];
          case "B7": return [-5.15, -3.85];
          case "C1": return [5.05, -1.92];
          case "C2": return [3.35, -1.92];
          case "C3": return [1.55, -1.92];
          case "C4": return [-0.05, -1.92];
          case "C5": return [-1.75, -1.92];
          case "C6": return [-3.45, -1.92];
          case "C7": return [-5.15, -1.92];
          case "D1": return [5.05, 0];
          case "D2": return [3.35, 0];
          case "D3": return [1.55, 0];
          case "D4": return [-0.05, 0];
          case "D5": return [-1.75, 0];
          case "D6": return [-3.45, 0];
          case "D7": return [-5.15, 0];
          case "E1": return [5.05, 1.93];
          case "E2": return [3.35, 1.93];
          case "E3": return [1.55, 1.93];
          case "E4": return [-0.05, 1.93];
          case "E5": return [-1.75, 1.93];
          case "E6": return [-3.45, 1.93];
          case "E7": return [-5.15, 1.93];
          case "F1": return [5.05, 3.86];
          case "F2": return [3.35, 3.86];
          case "F3": return [1.55, 3.86];
          case "F4": return [-0.05, 3.86];
          case "F5": return [-1.75, 3.86];
          case "F6": return [-3.45, 3.86];
          case "F7": return [-5.15, 3.86];
          case "G1": return [5.05, 5.78];
          case "G2": return [3.35, 5.78];
          case "G3": return [1.55, 5.78];
          case "G4": return [-0.05, 5.78];
          case "G5": return [-1.75, 5.78];
          case "G6": return [-3.45, 5.78];
          case "G7": return [-5.15, 5.78];
          default: return [0,0];
        }
      },
      countDownTimer () {
        if (this.countDown > 0) {
          this.isBonus = "yes"
          setTimeout(() => {
          this.countDown -= 1
          this.countDownTimer()
          }, 1000)
        }
        else{
          this.isBonus = "no"
        }
      },
      getCountDown(){
        this.assignedTime = new Date(this.assignedTime)
        const milliSecRemaining = Math.abs(this.assignedTime - (new Date())) 
        const secRemaining = milliSecRemaining / 1000
        return Math.trunc(this.estMin*60 - secRemaining)
      },
      async updateDeliveryStatus(){
        this.loadingOverlay = true
        console.log("updateDeliveryStatus")
        console.log(this.deliveryID)
        if(this.deliveryID != ""){
            if(this.status == 2){
              this.loadingOverlay = true
              await DeliveryService.updateDelivery({
                status: 3,
                pickupActualTime: new Date()
              }, this.deliveryID).then((response)=>{
                console.log(response)
                this.statusBtnMsg = "Deliveryed"
                this.showStatusBtn = true
                this.status = 3
                this.loadingOverlay = false
                this.refresPage = !this.refreshPage
              })
            }
            else if(this.status == 3){
              this.loadingOverlay = true
              this.assignedTime = new Date(this.assignedTime)
              const milliSecRemaining = Math.abs(this.assignedTime - (new Date())) 
              const secRemaining = milliSecRemaining / 1000
              this.timeElapsed = Math.trunc(secRemaining / 60)
              await DeliveryService.updateDelivery({
                status: 4,
                deliveryActualTime: new Date(),
                deliveryTimeMin: this.timeElapsed,
                isBonus: this.isBonus
              }, this.deliveryID).then((response)=>{
                console.log(response)
                this.showStatusBtn = false
                this.status = 4
                this.loadingOverlay = false
                this.refreshPage = !this.refreshPage
              })
            }
        }
      }
    },
    watch: {
      countDown: function (){
        const minutes = Math.floor(this.countDown / 60);
        const extraSeconds = this.countDown % 60;
        this.countDownTimerView = minutes + ":" + (extraSeconds < 10 ? "0" + extraSeconds : extraSeconds)
      }
    },
    beforeMount() {
      this.loadingOverlay = true
      this.getDeliveryID()
      this.GetDeliveryDetails()
      console.log("new date: " + new Date())
      this.countDown = 0

    }
  }
</script>
