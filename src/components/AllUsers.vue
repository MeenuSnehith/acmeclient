<template>
  <div>
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

    <v-card class="mx-auto px-10 py-8" width="90%" height="100">
      <v-row> 
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="username"
            clearable
            label="UserName"
            ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="password"
            clearable
            label="Password"
            ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="selectRole"
            label="Select role"
            :items="['Clerk', 'Deliveryman']"
          ></v-select>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-btn
            color="primary"
            size="large"
            type="submit"
            variant="elevated"
            rounded="xl"
            @click="AddUser"
          >
            Add User
          </v-btn>
        </v-col>
        
      </v-row>
    </v-card>
    <br/>

    <v-card class="mx-auto px-10 py-8" width="90%" height="500">
      <div>
        <v-row> 
          <v-col col="6" mb="2">
            <h4>Clerks</h4>
            <v-virtual-scroll :items="clerks" height="300" item-height="50">
                <template v-slot:default="{ item }">
                  <v-list-item>
                    <v-list-item-title>{{ item.username }}</v-list-item-title>
                    <template v-slot:append>
                      <v-btn size="small" variant="tonal" @click="deleteUser(item)">
                        <v-icon color="orange-darken-4" end> mdi-delete-empty </v-icon>&nbsp;
                        Delete
                      </v-btn>
                    </template>
                  </v-list-item>
                  <v-divider></v-divider>
                </template>
              </v-virtual-scroll>
          </v-col>
          <v-col col="6" mb="2">
            <h4>Delivery man</h4>
            <v-virtual-scroll :items="deliveryman" height="300" item-height="50">
                <template v-slot:default="{ item }">
                  <v-list-item>
                    <v-list-item-title>{{ item.username }}</v-list-item-title>
                    <template v-slot:append>
                      <v-btn size="small" variant="tonal" @click="deleteUser(item)">
                        <v-icon color="orange-darken-4" end> mdi-delete-empty </v-icon>&nbsp;
                        Delete
                      </v-btn>
                    </template>
                  </v-list-item>
                  <v-divider></v-divider>
                </template>
              </v-virtual-scroll>
          </v-col>
        </v-row>
    <br/>
      </div>
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
import UserAuthenticationService from '@/services/UserAuthenticationService'

  export default {
    data: () => ({
      refreshAllTrips: false,
      loadingOverlay: false,
      diableOverlay:true,
      loadingMSG: "Loading...",

      username: "",
      password: "",
      selectRole:"",
      clerks: [],
      deliveryman: []
    }),

    methods: {
      async getAllUsers(){
        await UserAuthenticationService.getAlUsers().then((response)=>{
            response.data.forEach(element => {
              if(element.permission == "2"){
                this.clerks.push(element)
              }
              else if(element.permission == "3"){
                this.deliveryman.push(element)
              }
            });
            this.loadingOverlay = false
        })
      },
      async AddUser(){
        if(this.selectRole == "Clerk"){
        this.loadingOverlay = true
          await UserAuthenticationService.register({
            username: this.username,
            password: this.password,
            permission: "2"
          }).then((response)=>{
            console.log("create clerk: " + response)
            this.clerks.push({
              "id" : response.data.id,
              "username" : response.data.username,
              "permission" : response.data.permission
            })
            
            this.username = ""
            this.password = ""
            this.selectRole = ""
            
            this.loadingOverlay = false
          })
        }
        else if(this.selectRole == "Deliveryman"){
          this.loadingOverlay = true
          await UserAuthenticationService.register({
            username: this.username,
            password: this.password,
            permission: "3"
          }).then((response)=>{
            console.log("create Delivery man: " + response)
             this.deliveryman.push({
              "id" : response.data.id,
              "username" : response.data.username,
              "permission" : response.data.permission
            })
            
            this.username = ""
            this.password = ""
            this.selectRole = ""
            
            this.loadingOverlay = false
          })
        }
        else{
          this.showSnackles("Please Fill all details to continue.")
        }
      },
      async deleteUser(user){
        console.log(user)
        this.loadingOverlay = true
        this.loadingMSG = "Deleting..."
        var deleteHot = await UserAuthenticationService.deleteUser(user.id).then(()=> {
          this.loadingOverlay = false
          this.refreshAllTrips = !this.refreshAllTrips
        })
        console.log(deleteHot)
      }
    },
    beforeMount() {
      console.log("All Users start...")
      this.loadingOverlay = true
      this.getAllUsers()
    },
    watch: {
      refreshAllTrips: function(){
        this.loadingOverlay = true
        this.clerks = []
        this.deliveryman = []
        this.getAllUsers()
      }
    }
  }
</script>
