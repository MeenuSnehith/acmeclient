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
      <v-virtual-scroll :items="users" height="500" item-height="50">
        <template v-slot:default="{ item }">
          <v-list-item>
            <v-list-item-title>User Name: {{ item.username }}</v-list-item-title>
            <template v-slot:append>
              <v-btn size="small" variant="tonal" @click="getReportByID(item.username)">
                <v-icon color="orange-darken-4" end> mdi-download  </v-icon>&nbsp;
                Generate Report
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
              <div  v-for="cust in courierReport" v-bind:key="cust.UserName">
              <v-card class="mx-auto px-10 py-8" width="800px" height="150px">
                <v-row><h4>User Name: </h4> &nbsp; <p>{{ cust.UserName }}</p></v-row>
                <v-row><h4>Number of Devliveries: </h4> &nbsp; <p>{{ cust.noofDeliveries }}</p></v-row>
                <v-row><h4>Number of Completed Delivery: </h4> &nbsp; <p>{{ cust.noofCompleted }}</p></v-row>
                <v-row><h4>Number of Bonus: </h4> &nbsp; <p>{{ cust.noofBonus }}</p></v-row>
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
                          From Customer
                        </th>
                        <th class="text-left">
                          To Customer
                        </th>
                        <th class="text-left">
                          Cost ($)
                        </th>
                        <th class="text-left">
                          Delivery Time (Min)
                        </th>
                        <th class="text-left">
                          Delivered Time (Min)
                        </th>
                        <th class="text-left">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="item in cust.deliveries"
                        :key="item.name"
                      >
                        <td>{{ item.DeliveryID }}</td>
                        <td>{{ item.FromCustomer }}</td>
                        <td>{{ item.ToCustomer }}</td>
                        <td>{{ item.Cost }}</td>
                        <td>{{ item.deliveryTime }}</td>
                        <td>{{ item.deliveredTime }}</td>
                        <td>{{ item.status }}</td>
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
import DeliveryService from '@/services/DeliveryService'
import UserAuthenticationService from '@/services/UserAuthenticationService'
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

      users: [],
      opt: {
          margin: 0,
          filename: 'myfile.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        },
      
      courierReport: [],
      fromReport: "",
      toReport: ""
    }),

    methods: {

      exportToPDF() {
        this.opt.filename = "Report_" + this.fromReport + "-" + this.toReport + ".pdf"
        html2pdf().set(this.opt).from(document.getElementById('pdf')).save()
        this.courierReport = []
        this.invoiceOverlay = false
      },
      async getAllUsers(){
        await UserAuthenticationService.getAlUsers().then((response)=>{
            response.data.forEach(element => {
              if(element.permission == "3"){
                this.users.push(element)
              }
            });
            this.loadingOverlay = false
        })
      },
      async getReportByID(currentUser) {
        this.loadingOverlay = true

        if(this.fromReport != "" && this.toReport != ""){
          try{
            await DeliveryService.getReport({
              startDate: this.fromReport.toString(),
              endDate: this.toReport.toString(),
              orderTakenBy: currentUser
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
                    var tempuserID = response.data[0].orderTakenBy
                    var tempcustResp = response.data
                    tempcustResp.forEach(element => {
                      console.log("---------------------------------------")
                      console.log("start")
                      console.log("" + element)
                      if(element.orderTakenBy == null){
                        console.log("Delivery not assigned to none")
                      }
                      else{
                        tempuserID = element.orderTakenBy

                        console.log("current custID: " + tempuserID)
                        console.log("traversed" + (traversedId.filter( y => y == tempuserID)).length)

                        if((traversedId.filter( y => y == tempuserID)).length > 0){
                          console.log("user id already processed.")
                        }
                        else{
                          traversedId.push(element.orderTakenBy)
                          var tempCust = tempcustResp.filter( x => x.orderTakenBy == tempuserID)
                          console.log(tempCust)
                          this.processInvoice(tempCust)
                        }
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
        var completedCount = 0
        var bonusCount = 0
        var tempStatus = ""
        deliveries.forEach(element => {
          //status
          if(element.status == 2){
            tempStatus = "Assigned"
          }
          else if(element.status == 3){
            tempStatus = "PickedUp"
          }
          else if(element.status == 4){
            tempStatus = "Completed"
          }
          else{
            tempStatus = ""
          }
           
          invoiceDelivery.push(
            {
              DeliveryID: element.id,
              FromCustomer: element.pickupCustomerName + "-" + element.pickupStreet + element.pickupAvn,
              ToCustomer: element.deliveryCustomerName + "-" + element.deliveryStreet + element.deliveryAvn,
              Cost: element.estimatedPrice,
              deliveryTime: element.estMin,
              deliveredTime: element.deliveryTimeMin,
              status: tempStatus
            }
          )
          dueAmount = dueAmount + element.estimatedPrice
          deliveryCount++
          if(element.status == 4){
            completedCount++
          }
          if(element.isBonus == "yes"){
            bonusCount++
          }
        });
        var invoice = {
            UserName: deliveries[0].orderTakenBy,
            noofDeliveries: deliveryCount,
            noofCompleted: completedCount,
            noofBonus: bonusCount,
            deliveries: invoiceDelivery
        }
        this.courierReport.push(invoice)
        this.invoiceOverlay = true
      }
    },
    beforeMount() {
      this.loadingOverlay = true
      this.getAllUsers()
      
    },
    watch: {
      refreshAllTrips: function(){
        this.loadingOverlay = true
        this.users = []
        this.courierReport = []
        this.getAllUsers()
      }
    }
  }
</script>

<style>
.scroll {
   overflow-y: scroll
}
</style>
