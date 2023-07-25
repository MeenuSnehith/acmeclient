<template>
  <v-sheet>
    <v-card class="mx-auto px-6 py-8" max-width="100%">
      <v-form
        v-model="form"
        @submit.prevent="onSubmit"
      >
        <v-container>
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <h5>Pickup</h5>
              <v-text-field
              v-model="pupCustName"
              label="Customer Name"
            ></v-text-field>
            <v-text-field
              v-model="pupCustID"
              label="Customer ID"
              v-show="false"
            ></v-text-field>
            <v-text-field
              v-model="pupCustStreet"
              label="Street"
            ></v-text-field>
            <v-text-field
              v-model="pupCustAvenue"
              label="Avenue"
            ></v-text-field>
            <v-text-field
              v-model="pickuptime"
              label="Pickup Time"
              type="datetime-local"
            ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <h5>Delivery</h5>
              <v-text-field
              v-model="dlyCustName"
              label="Customer Name"
            ></v-text-field>
            <v-text-field
              v-model="dlyCustID"
              label="Customer ID"
              v-show="false"
            ></v-text-field>
            <v-text-field
              v-model="dlyCustStreet"
              label="Street"
            ></v-text-field>
            <v-text-field
              v-model="dlyCustAvenue"
              label="Avenue"
            ></v-text-field>
            </v-col>
          </v-row>

            <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-btn
              block
              color="primary"
              size="large"
              variant="elevated"
              rounded="xl"
              @click="openCustomerOverlay"
            >
              Get Customer
            </v-btn>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-btn
              block
              color="primary"
              size="large"
              variant="elevated"
              rounded="xl"
              @click="getCalculatedDelivery()"
            >
              Calculate Route
            </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
              md="3"
            >
              <v-text-field
              v-model="estMin"
              label="Estimated delivery time - Minutes"
              disabled
            ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="3"
            >
              <v-text-field
              v-model="estDistance"
              label="Estimated Price"
              disabled
            ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-text-field
              v-model="pupRoute"
              label="Pickup route"
              disabled
            ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-text-field
              v-model="dlyRoute"
              label="Delivery route"
              disabled
            ></v-text-field>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col
              cols="12"
              md="5"
            >
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
            <v-btn
              block
              color="primary"
              size="large"
              variant="elevated"
              rounded="xl"
              @click="createDelivery"
            >
              Create Delivery
            </v-btn>
            </v-col>
          </v-row>
        </v-container>
        
        <br/>

        
      </v-form>
    </v-card>


    <v-overlay
      :model-value="custOverlay"
      class="align-center justify-center"
    >
      <v-card class="mx-auto px-10 py-8" width="800px" height="800">
          <v-row>
            <v-col cols="8">
              <v-text-field
                v-model="custName"
                class="mb-2"
                clearable
                label="Customer Name"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-select
                v-model="custStreet"
                label="Street"
                :items="['A', 'B','C','D','E','F','G']"
              ></v-select>
            </v-col>
            <v-col cols="2">
              <v-select
                v-model="custAvenue"
                label="Avenue"
                :items="['1', '2','3','4','5','6','7']"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-btn 
                size="large"
                value="addCustomer"
                @click="addCustomer(1)">
                <v-icon>mdi-content-save</v-icon> &nbsp;
                Add Pickup Customer
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn 
                size="large"
                value="addCustomer"
                @click="addCustomer(2)">
                <v-icon>mdi-content-save</v-icon> &nbsp;
                Add Delivery Customer
              </v-btn>
            </v-col>
          </v-row>
          <br/>
          <v-divider></v-divider>
          <v-virtual-scroll :items="customers" height="500" item-height="50">
            <template v-slot:default="{ item }">
              <v-list-item>
                <v-list-item-title>Customer Name: {{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>Customer ID: {{ item.id }}</v-list-item-subtitle>
                <v-list-item-subtitle>Street: {{ item.street }} - Avenue {{ item.avenue }}</v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn size="small" variant="tonal" @click="addPickupCust(item)">
                    <v-icon color="orange-darken-4" end> mdi-plus  </v-icon>&nbsp;
                    Add Pickup
                  </v-btn>
                  &nbsp;
                  <v-btn size="small" variant="tonal" @click="addDeliveryCust(item)">
                    <v-icon color="orange-darken-4" end> mdi-plus </v-icon>&nbsp;
                    Add Delivery
                  </v-btn>
                </template>
              </v-list-item>
              <v-divider></v-divider>
            </template>
          </v-virtual-scroll>
      </v-card>    
    </v-overlay>

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

    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
    >
      Registeration Success. Please wait while redirecting...
    </v-snackbar>


    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
    >
      Trip added Successfully.
    </v-snackbar>
  </v-sheet>
</template>

<script>
import CustomerService from '@/services/CustomerService'
import DeliveryService from '@/services/DeliveryService'
import ConfigService from '@/services/ConfigService'

  export default {
    data: () => ({
      form: false,
      loadingOverlay: false,
      custOverlay: false,
      snackbar: false,
      timeout: 2000,

      pickuptime: "",
      pupCustName: "",
      pupCustID:"",
      pupCustStreet: "",
      pupCustAvenue: "",
      dlyCustName: "",
      dlyCustID:"",
      dlyCustStreet: "",
      dlyCustAvenue: "",
      custName: "",
      custStreet: "",
      custAvenue: "",

      pupRoute: "",
      pupDistance: 0,
      dlyRoute: "",
      dlyDistance: 0,
      backRoute: "",
      backDistance: 0,
      estDistance: "",
      estDateTime: "",
      estMin: 0,

      org: "C3",

      customers: [],

      distance: 1,
      time: 1,
    }),

    methods: {
      
      async getConfig(){
        this.loadingOverlay = true
        console.log("Distance: " + this.distance + ":: Time" + this.time)
        try{
          await ConfigService.getConfigs().then((response) => {
            console.log(response)
            if(response.statusText == "OK"){
              response.data.forEach(element => {
                console.log("ID: " + element.id)
                if(element.name == "Distance"){
                  this.distance = element.value
                }
                else if(element.name == "Time"){
                  this.time = element.value
                }
              });
              console.log("Get config success.")
            }
            this.loadingOverlay = false
          })
        }
        catch(err){
          console.log(err)
        }
      },
      openCustomerOverlay(){
        this.custOverlay = !this.custOverlay;
      },
      async getAllCustomers(){
        try{
          await CustomerService.getAllCustomers().then((response)=> {
                console.log(response)
                if(response.statusText == "OK"){
                  response.data.forEach(element => {
                    this.customers.push(element)
                  });
                }
              })
        }
        catch(err){
          console.log(err)
          console.log(err.message)
          this.showError(err.message)
        }
      },
      addPickupCust(cust){
        this.pupCustName = cust.name
        this.pupCustID = cust.id
        this.pupCustStreet = cust.street
        this.pupCustAvenue = cust.avenue
        this.custOverlay = !this.custOverlay;
      },
      addDeliveryCust(cust){
        this.dlyCustName = cust.name
        this.dlyCustID = cust.id
        this.dlyCustStreet = cust.street
        this.dlyCustAvenue = cust.avenue
        this.custOverlay = !this.custOverlay;
      },
      async addCustomer(addType){
        try{
          console.log(this.custName + this.custStreet + this.custAvenue)
          await CustomerService.addCustomer({
              name: this.custName,
              street: this.custStreet,
              avenue: this.custAvenue
          }).then((response)=> {
                console.log(response)
                if(response.statusText == "OK"){
                  if(addType == 1){
                    this.addPickupCust(response.data)
                  }
                  else{
                    this.addDeliveryCust(response.data)
                  }
                  this.customers.push(response.data)
                  this.custName = ""
                  this.custStreet = "",
                  this.custAvenue = ""
                }
              }
          )
        }
        catch(err){
          console.log(err)
          console.log(err.response.data.error)
          this.showError(err.response.data.error)
        }
      },
      async createDelivery(){
        this.loadingOverlay = true
        try{
          await DeliveryService.addDelivery({
              pickupCustomerName: this.pupCustName,
              pickupCustomerId: this.pupCustID,
              pickupAvn: this.pupCustAvenue,
              pickupStreet: this.pupCustStreet,
              pickupRoute: this.pupRoute,
              pickupTime: this.pickuptime.toString(),
              deliveryCustomerName: this.dlyCustName,
              deliveryCustomerId: this.dlyCustID,
              deliveryAvn: this.dlyCustAvenue,
              deliveryStreet: this.dlyCustStreet,
              deliveryRoute: this.dlyRoute,
              deliveryTime: this.estDateTime.toString(),
              backToOfficeRoute: this.backRoute,
              estimatedPrice: this.estDistance,
              estMin: this.estMin,
              status: "1"
          }).then((response) => {
            console.log(response)
            if(response.statusText == "OK"){
              this.pupCustName = ""
              this.pupCustID = ""
              this.pupCustAvenue = ""
              this.pupCustStreet = ""
              this.pickuptime = ""
              this.dlyCustName = ""
              this.dlyCustID = ""
              this.dlyCustAvenue = ""
              this.dlyCustStreet = ""
              this.pupRoute = ""
              this.pupDistance = ""
              this.dlyRoute = ""
              this.dlyDistance = ""
              this.backRoute = ""
              this.backDistance = ""
              this.estDistance = ""
              this.estDateTime = ""
              this.estMin = ""
            }
            this.loadingOverlay = false
          })
        }
        catch(err){
          console.log(err)
          console.log(err.response.data.error)
        }
      },
      getCalculatedDelivery(){
        this.getPickUpRoute().then(()=> {
          this.getDeliveryRoute().then(()=> {
            this.getBackToOfficeRoute().then(()=> {
              this.estDistance = (this.pupDistance + this.dlyDistance + this.backDistance) * this.distance
              this.estMin = (this.pupDistance + this.dlyDistance) * this.time 
              const tempDate = new Date(this.pickuptime)
              this.estDateTime = new Date(tempDate.getTime() + this.estMin*60000)
            })
          })
        })
      },
      async getPickUpRoute(){
        this.loadingOverlay = true
        console.log("start: " + this.org + ":: end" + this.pupCustStreet + this.pupCustAvenue)
        try{
          await DeliveryService.getShortestPath({
              source: this.org,
              destination: this.pupCustStreet + this.pupCustAvenue
          }).then((response) => {
            console.log(response)
            if(response.statusText == "OK"){
              this.pupRoute = response.data.shortestPath.path.toString()
              this.pupDistance = response.data.shortestPath.distance
              console.log("pick up route: " + response.data.shortestPath.path)
            }
            this.loadingOverlay = false
          })
        }
        catch(err){
          console.log(err)
          console.log(err.response.data.error)
        }
      },
      async getDeliveryRoute(){
        this.loadingOverlay = true
        try{
          await DeliveryService.getShortestPath({
              source: this.pupCustStreet + this.pupCustAvenue,
              destination: this.dlyCustStreet + this.dlyCustAvenue
          }).then((response) => {
            console.log(response)
            if(response.statusText == "OK"){
              this.dlyRoute = response.data.shortestPath.path.toString()
              this.dlyDistance = response.data.shortestPath.distance
              console.log("pick up route: " + response.data.shortestPath.path)
            }
            this.loadingOverlay = false
          })
        }
        catch(err){
          console.log(err)
          console.log(err.response.data.error)
        }
      },
      async getBackToOfficeRoute(){
        this.loadingOverlay = true
        try{
          await DeliveryService.getShortestPath({
              source: this.dlyCustStreet + this.dlyCustAvenue,
              destination: this.org
          }).then((response) => {
            console.log(response)
            if(response.statusText == "OK"){
              this.backRoute = response.data.shortestPath.path.toString()
              this.backDistance = response.data.shortestPath.distance
              console.log("back to office route: " + response.data.shortestPath.path)
            }
            this.loadingOverlay = false
          })
        }
        catch(err){
          console.log(err)
          console.log(err.response.data.error)
        }
      }
    },
    beforeMount() {
      console.log("Add delivery start")
      this.getConfig()
      this.getAllCustomers()
    },
    watch: {
      pickuptime: function(){
        console.log(this.pickuptime)
      }
    }
  }
</script>
