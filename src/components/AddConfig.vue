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
              <h5>Config</h5>
              <v-text-field
              v-model="distance"
              label="Distance"
              type="number"
              ></v-text-field>
              <v-text-field
              v-model="distanceID"
              label="distanceid"
              v-show="false"
            ></v-text-field>
              <br/>
              <v-text-field
                v-model="time"
                label="Time in Mins"
                type="number"
              ></v-text-field>
              <v-text-field
                v-model="timeID"
                label="timeid"
                v-show="false"
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
            <br/>
              <v-btn
              block
              color="primary"
              size="large"
              variant="elevated"
              rounded="xl"
              @click="updateConfig('Distance')"
            >
              Save Distance Config
            </v-btn>
            <br/>
            <br/>
            <br/>

            <v-btn
              block
              color="primary"
              size="large"
              variant="elevated"
              rounded="xl"
              @click="updateConfig('Time')"
            >
              Save Time Config
            </v-btn>
            </v-col>
          </v-row>
        </v-container>
        
        <br/>
        
      </v-form>
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

    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
    >
      Save Success. Please wait while redirecting...
    </v-snackbar>
  </v-sheet>
</template>

<script>
import ConfigService from '@/services/ConfigService'

  export default {
    data: () => ({
      form: false,
      loadingOverlay: false,
      custOverlay: false,
      snackbar: false,
      timeout: 2000,

      distance: 0,
      distanceID: 0,
      time: 0,
      timeID: 0,

      org: "C3",

      customers: []
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
                  this.distanceID = element.id
                }
                else if(element.name == "Time"){
                  this.time = element.value
                  this.timeID = element.Id
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
      async updateConfig(configName){
        this.loadingOverlay = true
        let configValue = 0
        let configId = 0
        if(configName == "Distance"){
          configValue = this.distance
          configId = this.distanceID
        }
        else if(configName == "Time"){
          configValue = this.time
          configId = this.timeID
        }
        else{
          return;
        }

        try{
          await ConfigService.updateConfig({
            name: configName,
            value: configValue
          }, configId).then((response) => {
            console.log(response)
            this.loadingOverlay = false
          })
        }
        catch(err){
          console.log(err)
        }
      }
    },
    beforeMount() {
      console.log("Add delivery start")
      this.getConfig()
    },
    watch: {
    }
  }
</script>
