<template>
  <v-sheet>
    <v-card class="mx-auto px-10 py-8" max-width="85%">
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
          <p>$ {{cost}}</p>
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


  export default {
    data: () => ({
      loadingOverlay: false,
      diableOverlay:true,
      lochtlOverlay: false,
      username: "",

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
      deliveryTime: "2023-06-27T17:01",
      estimatedCost: "",
      delivery: ""
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
          this.pickUpTime = this.delivery.pickupTime != null ? this.delivery.pickupTime.toString().substring(0,16) : ""
          this.deliveryTime = this.delivery.deliveryTime != null ? this.delivery.deliveryTime.toString().substring(0,16) : ""
          this.estimatedCost = this.delivery.estimatedPrice
          
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
            status: "2"
          }, this.deliveryID).then((response)=>{
            console.log(response)
            this.orderTakenBy = this.username
          })
        }
      }
    },
    watch: {
    },
    beforeMount() {
      this.loadingOverlay = true
      this.getDeliveryID()
      this.GetDeliveryDetails()
    }
  }
</script>
