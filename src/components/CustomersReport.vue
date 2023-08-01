<template>
  <div :key="refreshAllTrips">
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
        <v-col cols="4">
          <v-text-field
            v-model="fromReport"
            label="From"
            type="date"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="toReport"
            label="To"
            type="date"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-btn
            @click="getreports"
          >
            genrate Invoice
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
                  <v-btn size="small" variant="tonal" @click="getReportByID(item.id)">
                    <v-icon color="orange-darken-4" end> mdi-download  </v-icon>&nbsp;
                    Generate Invoice
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

    <v-overlay
      :model-value="invoiceOverlay"
      class="align-center justify-center"
    >
      <v-card class="mx-auto px-10 py-8" width="850px" height="50px">
        <v-row>
          <v-btn
            @click="exportToPDF"
          >
            Download
          </v-btn>
        </v-row>
      </v-card>
      <v-card class="scroll" height="650px">
        <vue-html2pdf
            :show-layout="false"
            :preview-modal="true"
            :paginate-elements-by-height="10"
            :filename="test"
            :pdf-quality="2"
            :pdf-format="size"
            :ref="ref"
            id= "pdf"
          >
            <section >
                <section class="pdf-item">
                  <div  v-for="cust in customerReport" v-bind:key="cust.CustomerID">
                  <v-card class="mx-auto px-10 py-8" width="800px" height="150px">
                    <v-row><h4>Customer Name: </h4> &nbsp; <p>{{ cust.CustomerName }}</p></v-row>
                    <v-row><h4>Customer ID: </h4> &nbsp; <p>{{ cust.CustomerID }}</p></v-row>
                    <v-row><h4>Address: </h4> &nbsp; <p>{{ cust.Address }}</p></v-row>
                    <v-row><h4>Number of Devliveries: </h4> &nbsp; <p>{{ cust.noofDeliveries }}</p></v-row>
                    <v-row><h4>Due amount: </h4> &nbsp; <p>{{ cust.Cost }}</p></v-row>
                  </v-card>
                  <v-card class="mx-auto px-10 py-8"  width="800px" height="500px">
                    <v-row>
                      <h3>Deliveries:</h3>
                    </v-row>
                    <v-row>
                      <v-table density="compact">
                        <thead>
                          <tr>
                            <th class="text-left">
                              Delivery ID
                            </th>
                            <th class="text-left">
                              To
                            </th>
                            <th class="text-left">
                              Address
                            </th>
                            <th class="text-left">
                              Cost ($)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="item in cust.deliveries"
                            :key="item.name"
                          >
                            <td>{{ item.DeliveryID }}</td>
                            <td>{{ item.ToCustomer }}</td>
                            <td>{{ item.Address }}</td>
                            <td>{{ item.Cost }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-row>
                  </v-card>
                  <div class="html2pdf__page-break"></div>
                  </div>
                </section>
            </section>
          </vue-html2pdf>
        </v-card>
    </v-overlay>
  </div>
</template>

<script>
import CustomerService from '@/services/CustomerService'
import DeliveryService from '@/services/DeliveryService'
import html2pdf from "html2pdf.js";

  export default {
    data: () => ({
      refreshAllTrips: false,
      loadingOverlay: false,
      invoiceOverlay: false,
      editOverlay: false,
      diableOverlay:true,

      lochtlOverlay: false,
      loadingMSG: "Loading...",
      custName: "",
      custStreet: "",
      custAvenue: "",

      customers: [],
      opt: {
          margin: 0,
          filename: 'myfile.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        },
      
      customerReport: [],
      fromReport: "",
      toReport: ""
    }),

    methods: {
      exportToPDF() {
        this.opt.filename = "Invoice_" + this.fromReport + "-" + this.toReport + ".pdf"
        html2pdf().set(this.opt).from(document.getElementById('pdf')).save()
        this.customerReport = []
        this.invoiceOverlay = false
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
                this.loadingOverlay = false
              })
        }
        catch(err){
          console.log(err)
          console.log(err.message)
        }
      },
      async getReportByID(currentCustomerID) {
        this.loadingOverlay = true

        if(this.fromReport != "" && this.toReport != ""){
          try{
            await DeliveryService.getInvoiceByID({
              startDate: this.fromReport.toString(),
              endDate: this.toReport.toString(),
              customerID: currentCustomerID
          }).then((response)=> {
            console.log(response)
                if(response.statusText == "OK"){
                  if(response.data.length > 0){
                    this.processInvoice(response.data)
                  }
                }
                this.loadingOverlay = false
              })
          }
          catch(err){
            console.log(err)
            console.log(err.message)
            this.loadingOverlay = false
          }
        }
        else{
          console.log("Please fill from and to date.")
          this.loadingOverlay = false
        }
      },
      async getreports() {
        this.loadingOverlay = true

        if(this.fromReport != "" && this.toReport != ""){
          try{
            await DeliveryService.getInvoices({
              startDate: this.fromReport.toString(),
              endDate: this.toReport.toString()
              }).then((response)=> {
                console.log(response)
                if(response.statusText == "OK"){
                  if(response.data.length > 0){
                    var traversedId = []
                    var tempcustID = response.data[0].pickupCustomerId
                    var tempcustResp = response.data
                    tempcustResp.forEach(element => {
                      console.log("---------------------------------------")
                      console.log("start")
                      console.log("" + element)
                      tempcustID = element.pickupCustomerId

                      console.log("current custID: " + tempcustID)
                      console.log("traversed" + (traversedId.filter( y => y == tempcustID)).length)

                      if((traversedId.filter( y => y == tempcustID)).length > 0){
                        console.log("cust id already processed.")
                      }
                      else{
                        traversedId.push(element.pickupCustomerId)
                        var tempCust = tempcustResp.filter( x => x.pickupCustomerId == tempcustID)
                        console.log(tempCust)
                        this.processInvoice(tempCust)
                      }
                    });
                  }
                }
                this.loadingOverlay = false
              })
          }
          catch(err){
            console.log(err)
            console.log(err.message)
            this.loadingOverlay = false
          }
        }
        else{
          console.log("Please fill from and to date.")
          this.loadingOverlay = false
        }
      },
      processInvoice: function(deliveries){
        var invoiceDelivery = []
        var dueAmount = 0
        var deliveryCount = 0
        deliveries.forEach(element => {
          invoiceDelivery.push(
            {
              DeliveryID: element.id,
              ToCustomer: element.deliveryCustomerName,
              Address: element.deliveryStreet + element.deliveryAvn,
              Cost: element.estimatedPrice
            }
          )
          dueAmount = dueAmount + element.estimatedPrice
          deliveryCount++
        });
        var invoice = {
            CustomerName: deliveries[0].pickupCustomerName,
            CustomerID: deliveries[0].pickupCustomerId,
            Address: deliveries[0].pickupStreet + deliveries[0].pickupAvn,
            noofDeliveries: deliveryCount,
            Cost: dueAmount,
            deliveries: invoiceDelivery
        }
        this.customerReport.push(invoice)
        this.invoiceOverlay = true
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
        this.customerReport = []
        this.getAllCustomers()
      }
    }
  }
</script>

<style>
.scroll {
   overflow-y: scroll
}
</style>
