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
              v-model="days"
              label="Estimated delivery time"
              type="datetime-local"
              disabled
            ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="3"
            >
              <v-text-field
              v-model="nights"
              label="Estimated Price"
              disabled
            ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-text-field
              v-model="from"
              label="Pickup route"
              disabled
            ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-text-field
              v-model="from"
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
              <v-text-field
                v-model="custStreet"
                class="mb-2"
                clearable
                label="Street"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="custAvenue"
                class="mb-2"
                clearable
                label="Avenue"
              ></v-text-field>
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

      customers: []
    }),

    methods: {
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
          console.log(err.response.data.error)
          this.showError(err.response.data.error)
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
              pickupTime: this.pickuptime.toString(),
              deliveryCustomerName: this.dlyCustName,
              deliveryCustomerId: this.dlyCustID,
              deliveryAvn: this.dlyCustAvenue,
              deliveryStreet: this.dlyCustStreet,
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
      this.getAllCustomers()
    },
    watch: {
      pickuptime: function(){
        console.log(this.pickuptime)
      }
    }
  }
</script>
