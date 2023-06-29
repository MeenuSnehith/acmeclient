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
                label="Select Street"
                :items="['A', 'B','C','D','E','F','G']"
              ></v-select>
            </v-col>
            <v-col cols="2">
              <v-select
                v-model="custAvenue"
                label="Select Avenue"
                :items="['1', '2','3','4','5','6','7']"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-btn 
                size="large"
                value="AddNewLocation"
                @click="addCustomer()">
                <v-icon>mdi-plus-circle-outline</v-icon>
                Add Customer
              </v-btn>
            </v-col>
          </v-row>
          <br/>
          <v-divider></v-divider>
          <br/>
          <v-virtual-scroll :items="customers" height="500" item-height="50">
            <template v-slot:default="{ item }">
              <v-list-item>
                <v-list-item-title>Customer Name: {{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>Customer ID: {{ item.id }}</v-list-item-subtitle>
                <v-list-item-subtitle>Street: {{ item.street }} - Avenue {{ item.avenue }}</v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn size="small" variant="tonal" @click="deleteCustomer(item)">
                    <v-icon color="orange-darken-4" end> mdi-delete-empty  </v-icon>&nbsp;
                    Delete
                  </v-btn>
                  &nbsp;
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
import CustomerService from '@/services/CustomerService'

  export default {
    data: () => ({
      trips: null,
      refreshAllTrips: false,
      loadingOverlay: false,
      editOverlay: false,
      diableOverlay:true,

      lochtlOverlay: false,
      loadingMSG: "Loading...",
      custName: "",
      custStreet: "",
      custAvenue: "",

      customers: []
    }),

    methods: {
      async getAllCustomers(){
        try{
          await CustomerService.getAllCustomers().then((response)=> {
                console.log(response)
                if(response.statusText == "OK"){
                  response.data.forEach(element => {
                    this.customers.push(element)
                  });
                }
                this.loadingOverlay = false
              })
        }
        catch(err){
          console.log(err)
          console.log(err.response.data.error)
          this.showError(err.response.data.error)
        }
      },
      async addCustomer(){
        this.loadingOverlay = true
        try{
          console.log(this.custName + this.custStreet + this.custAvenue)
          await CustomerService.addCustomer({
              name: this.custName,
              street: this.custStreet,
              avenue: this.custAvenue
          }).then((response)=> {
                console.log(response)
                if(response.statusText == "OK"){
                  this.customers.push(response.data)
                  this.custName = ""
                  this.custStreet = "",
                  this.custAvenue = ""
                  this.refreshAllTrips = !this.refreshAllTrips
                }
                this.loadingOverlay = false
              }
          )
        }
        catch(err){
          console.log(err)
          console.log(err.response.data.error)
        }
      },
      async deleteCustomer(cust){
        console.log(cust)
        this.loadingOverlay = true
        this.loadingMSG = "Deleting..."
        var deleteCust = await CustomerService.deleteCustomer(cust.id).then(()=> {
          this.loadingOverlay = false
          this.refreshAllTrips = !this.refreshAllTrips
        })
        console.log(deleteCust)
      }
    },
    beforeMount() {
      this.loadingOverlay = true
      this.getAllCustomers()
    },
    watch: {
      refreshAllTrips: function(){
        this.loadingOverlay = true
        this.customers = []
        this.getAllCustomers()
      }
    }
  }
</script>
