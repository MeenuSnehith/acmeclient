<template>
  <v-sheet>
    <v-card class="mx-auto px-10 py-8" max-width="85%">
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="text-h6">
              Package ID: {{deliveryID}}
            </v-card-title>
            <v-card-subtitle class="text-p">
              Once Delivery is deleted its gone forever.
            </v-card-subtitle>
            <v-card-actions>
              <v-btn
                color="teal-accent-4"
                variant="elevated"
                rounded="xl"
                v-show="this.$store.state.permission == '1'"
                @click="updateDelivery"
              >
                Save
              </v-btn>
              <v-btn
                color="red-accent-4"
                variant="elevated"
                rounded="xl"
                v-show="this.$store.state.permission == '1'"
                @click="deleteDelivery"
              >
                Delete
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
          <v-text-field
              v-model="pickUpCust"
              label= "Name"
            ></v-text-field>
            <v-select
                v-model="pickUpStreet"
                label="Select Street"
                :items="['A', 'B','C','D','E','F','G']"
              ></v-select>
              <v-select
                v-model="pickUpAvenue"
                label="Select Avenue"
                :items="['1', '2','3','4','5','6','7']"
              ></v-select>
          <br/>
          <h4>Pickup Route: </h4>
          <p>{{pickUpRoute}}</p>
          <v-text-field
              v-model="pickUpTime"
              type="datetime-local"
              label= "Pick Up Time"
            ></v-text-field>  
        </v-col>
        <v-col
          cols="6"
        >
          <h3>Delivery Customer Details: </h3>
          <v-text-field
            v-model="deliveryCust"
            label= "Name"
          ></v-text-field>
          <v-select
              v-model="deliveryStreet"
              label="Select Street"
              :items="['A', 'B','C','D','E','F','G']"
            ></v-select>
            <v-select
              v-model="deliveryAvenue"
              label="Select Avenue"
              :items="['1', '2','3','4','5','6','7']"
            ></v-select>
          <br/>
          <h4>Delivery Route: </h4>
          <p>{{deliveryRoute}}</p>
          <v-text-field
              v-model="deliveryTime"
              type="datetime-local"
              label= "Delivery Time"
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
import router from '../router'

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
      deliveryTime: "",
      estimatedCost: "",
      delivery: ""
    }),

    methods: {
      async updateDelivery(){
      this.loadingOverlay = true
        console.log("update Delivery: " + this.deliveryID)
        if(this.pickUpTime != "" && this.deliveryTime != ""){
          await DeliveryService.updateDelivery({
            orderTakenBy: this.orderTakenBy,
            pickupCustomerName:this.pickUpCust,
            pickupCustomerId: this.pickUpCustID,
            pickupStreet: this.pickUpStreet,
            pickupAvn: this.pickUpAvenue,
            deliveryCustomerName: this.deliveryCust,
            deliveryCustomerId: this.deliveryCustID,
            deliveryStreet: this.deliveryStreet,
            deliveryAvn: this.deliveryAvenue,
            pickupRoute: this.pickUpRoute,
            deliveryRoute: this.deliveryRoute,
            pickupTime: this.pickUpTime,
            deliveryTime: this.deliveryTime,
            estimatedPrice: this.estimatedCost
          }, this.deliveryID).then((response) => {
            this.loadingOverlay = false
            console.log("update: " + response.data)
          })
        }
        else{
          alert("Please fill pickup time and delivery time.")
          this.loadingOverlay = false
        }
      },
      async deleteDelivery(){
        this.loadingOverlay = true
        console.log("delete Delivery: " + this.deliveryID)
        await DeliveryService.deleteDelivery(this.deliveryID).then((response) => {
          this.loadingOverlay = false
          console.log("delete: " + response.data)
          router.push("/")
        })
      },
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
        this.deliveryID = this.$store.state.editDeliveryId
        this.username = this.$store.state.username
        console.log("edit deliveryID: " + this.deliveryID)
      },
      async assignDelivery(){
        console.log("Assign Delivery")
        console.log(this.username)
        console.log(this.deliveryID)
        if(this.username != "" && this.deliveryID != ""){
          await DeliveryService.assignDelivery({
            orderTakenBy: this.username
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
