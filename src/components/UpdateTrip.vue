<template>
  <v-sheet>
    <v-card class="mx-auto px-10 py-8" max-width="85%" color="red-lighten-4">
      <v-row>
        <v-col
          cols="12"
        >
          <p>Once trip is deleted its lost forever.</p>
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
            color="red-darken-1"
            size="large"
            variant="elevated"
            rounded="xl"
            @click="deleteTrip()"
          >
            Delete Trip
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <br/> 

    <v-card class="mx-auto px-10 py-8" max-width="85%">
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-img
              :src= "URL"
              max-height="350"
              class="bg-grey-lighten-2"
            ></v-img>
            <v-card-title class="text-h6">
              <v-text-field
                v-model="URL"
                class="mb-2"
                clearable
                label="Thumbnail URL"
              ></v-text-field>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <br/>
      
      <v-row>
        <v-col
          cols="12"
          md="8"
        >
          <v-text-field
            v-model="title"
            clearable
            label="Title"
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="cost"
            label="Cost per Person (in $)"
            type="number"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          md="12"
        >
          <v-text-field
          v-model="location"
          clearable
          label="Location"
          ></v-text-field>
        </v-col>
      </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <v-text-field
              v-model="days"
              label="No of Days"
              type="number"
            ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="2"
            >
              <v-text-field
              v-model="nights"
              label="No of Nights"
              type="number"
            ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
              v-model="from"
              type="date"
              label="From date"
            ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
              v-model="to"
              type="date"
              label="To date"
            ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="12"
            >
              <v-textarea
              v-model="decription"
              class="mb-2"
              clearable
              label="Description"
            ></v-textarea>
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
              @click="UpdateTripDetails"
            >
              Save
            </v-btn>
            </v-col>
          </v-row>
    </v-card>

    <br/> 

    <v-card class="mx-auto px-10 py-8" max-width="85%">
      <v-row>
        <v-col cols="12">
          <v-carousel v-model="activeImg" :key="this.tripimgs">
            <v-carousel-item
              :src="img.url"
              cover
              v-for= "img in tripimgs" v-bind:key="img"
            ></v-carousel-item>
          </v-carousel>
        </v-col>
      </v-row>
      
      <br/>
      
      <v-row>
        <v-col cols="10">
          <v-text-field
            v-model="imgURL"
            class="mb-2"
            clearable
            label="Thumbnail URL"
          ></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-btn 
            size="x-large"
            value="Addnewurl"
            @click="addImg">
            <v-icon>mdi-plus-circle-outline</v-icon>
            Add
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-list>
            <v-list-item
              v-for="img in tripimgs"
              :key="img"
              :title="img.url"
            >
              <template v-slot:append>
                <v-btn
                  color="red"
                  icon="mdi-minus-circle-outline"
                  variant="text"
                  @click="deleteImg(img)"
                ></v-btn>
              </template>
            </v-list-item>
        </v-list>
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
              @click="UpdateImg"
            >
              Save
            </v-btn>
            </v-col>
          </v-row>
    </v-card>
    <br/> 

    <v-card class="mx-auto px-10 py-8" max-width="85%">
      <!-- Itinerary details -->
      <v-row>
        <v-col cols="2">
          <v-text-field
            v-model="dayIt"
            class="mb-2"
            label="Day"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="10">
          <v-text-field
            v-model="itenary"
            class="mb-2"
            clearable
            label="Activity"
          ></v-text-field>

          <v-text-field
            v-model="locName"
            v-show="false"
            label="loc id"
          ></v-text-field>
          <v-text-field
            v-model="hotelName"
            v-show="false"
            label="hotel id"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- location Virtual scroll -->
      <v-row :key="addLocAry">
        <v-col cols="9">
          <v-virtual-scroll :items="addLocAry" height="100" item-height="50">
            <template v-slot:default="{ item }">
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar
                    rounded="0"
                    :image="item.ImageURL"
                    class="text-white"
                    size="90"
                  >
                  </v-avatar>
                </template>
                <v-list-item-title>{{ item.Address }}</v-list-item-title>
                <v-list-item-title>{{ item.Description }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-col>
        <v-col cols="3">
          <v-btn 
            size="x-large"
            value="AddNewLocation"
            @click="showLocationOverLay()">
            <v-icon>mdi-plus-circle-outline</v-icon>
            Add Location
          </v-btn>
        </v-col>
      </v-row>

      <!-- hotel Virtual scroll -->
      <v-row :key="addHotelAry">
        <v-col cols="9">
          <v-virtual-scroll :items="addHotelAry" height="100" item-height="50">
            <template v-slot:default="{ item }">
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar
                    rounded="0"
                    :image="item.ImageURL"
                    class="text-white"
                    size="90"
                  >
                  </v-avatar>
                </template>
                <v-list-item-title>{{ item.HotelName }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-col>
        <v-col cols="3">
          <v-btn 
            size="x-large"
            value="AddNewHotel"
            @click="showHotelOverLay()">
            <v-icon>mdi-plus-circle-outline</v-icon>
            Add Hotel
          </v-btn>
        </v-col>
      </v-row>

      <!-- Add Itinerary details -->
      <v-row>
        <v-col cols="4">
        </v-col>
        <v-col cols="2">
          <v-btn 
            size="x-large"
            value="AddNewItenary"
            @click="addItenary">
            <v-icon>mdi-plus-circle-outline</v-icon>
            Add Day
          </v-btn>
        </v-col>
        <v-col cols="2">
          <v-btn 
            size="x-large"
            value="AddNewItenary"
            @click="clearItineraryAdd">
            <v-icon>mdi-minus-circle-outline</v-icon>
            Clear
          </v-btn>
        </v-col>
      </v-row>

      <!-- show Itinerary details -->
      <v-row>
        <v-col>
        <v-list>
          <v-list-item
            v-for="it in itenarys"
            :key="it.day"
            :title="it.data"
          >
            <template v-slot:default>
              <v-btn
                size="small"
                variant="plain"
                color="blue"
                @click="showAddedLocAndHotels(it.locationID, it.hotelID)"
              >Show Locations and Hotels</v-btn>
            </template>
            <template v-slot:append>
              <v-btn
                color="red"
                icon="mdi-minus-circle-outline"
                variant="text"
                @click="deleteItenary(it)"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>
        </v-col>
      </v-row>

      <!-- save Itinerary details -->
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
              @click="UpdateItinerarys"
            >
              Save
            </v-btn>
            </v-col>
      </v-row>

      <!-- All Location overlay -->
      <v-overlay v-model="locOverlay" contained class="align-center justify-center">
        <v-card class="mx-auto px-10 py-8" width="800px" height="700">
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="createLocIMG"
                class="mb-2"
                clearable
                label="Location Image URL"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="createLoc"
                class="mb-2"
                clearable
                label="Location"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="createLocDes"
                class="mb-2"
                clearable
                label="Description"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-btn 
                size="large"
                value="AddNewLocation"
                @click="createLocation()">
                <v-icon>mdi-plus-circle-outline</v-icon>
                Add Location
              </v-btn>
            </v-col>
          </v-row>
          <br/>
          <v-divider></v-divider>
          <br/>
          <v-virtual-scroll :items="allLoc" height="300" item-height="50">
            <template v-slot:default="{ item }">
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar
                    rounded="0"
                    :image="item.ImageURL"
                    class="text-white"
                    size="90"
                  >
                  </v-avatar>
                </template>

                <v-list-item-title>{{ item.Address }}</v-list-item-title>
                <v-list-item-title>{{ item.Description }}</v-list-item-title>
                <template v-slot:append>
                  <v-btn size="small" variant="tonal" @click="addLocationFromList(item)">
                    <v-icon color="orange-darken-4" end> mdi-plus </v-icon>
                    Add Location
                  </v-btn>
                </template>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-card>
      </v-overlay>

      <!-- All Hotel overlay -->
      <v-overlay v-model="hotelOverlay" contained class="align-center justify-center">
        <v-card class="mx-auto px-10 py-8" width="800px" height="700">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="createHotelIMG"
                class="mb-2"
                clearable
                label="Hotel Image URL"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="createHotelname"
                class="mb-2"
                clearable
                label="Hotel Name"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-btn 
                size="large"
                value="AddNewLocation"
                @click="createHotel()">
                <v-icon>mdi-plus-circle-outline</v-icon>
                Add Hotel
              </v-btn>
            </v-col>
          </v-row>
          <br/>
          <v-divider></v-divider>
          <br/>
          <v-virtual-scroll :items="allHotel" height="300" item-height="50">
            <template v-slot:default="{ item }">
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar
                    rounded="0"
                    :image="item.ImageURL"
                    class="text-white"
                    size="90"
                  >
                  </v-avatar>
                </template>

                <v-list-item-title>{{ item.HotelName }}</v-list-item-title>
                <v-list-item-title></v-list-item-title>
                <template v-slot:append>
                  <v-btn size="small" variant="tonal" @click="addHotelFromList(item)">
                    <v-icon color="orange-darken-4" end> mdi-plus </v-icon>
                    Add Hotel
                  </v-btn>
                </template>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-card>
      </v-overlay>

      <!-- Locations and Hotel overlay -->
      <v-overlay v-model="lochtlOverlay" contained class="align-center justify-center">
        <v-card class="mx-auto px-10 py-8" width="800px" height="530">
          <h4>Locations:</h4>
          <v-divider></v-divider>
          <v-virtual-scroll :items="showLoc" height="200" item-height="50">
            <template v-slot:default="{ item }">
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar
                    rounded="0"
                    :image="item.ImageURL"
                    class="text-white"
                    size="90"
                  >
                  </v-avatar>
                </template>

                <v-list-item-title>{{ item.Address }}</v-list-item-title>
                <v-list-item-title>{{ item.Description }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-virtual-scroll>
          <br/>
          <h4>Hotels:</h4>
          <v-divider></v-divider>
          <v-virtual-scroll :items="showHtl" height="200" item-height="50">
            <template v-slot:default="{ item }">
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar
                    rounded="0"
                    :image="item.ImageURL"
                    class="text-white"
                    size="90"
                  >
                  </v-avatar>
                </template>

                <v-list-item-title>{{ item.HotelName }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-virtual-scroll>
          <br/>
          <br/>
        </v-card>
      </v-overlay>
    </v-card>

    <v-card class="mx-auto px-10 py-8" max-width="100%" max-height="20%">
    </v-card>


    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
    >
      {{snackbarMsg}}
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
    {{loadingOverlayMSG}}
  </v-sheet>
</template>

<script>
//import router from '../router'
import TripsService from '@/services/TripsService'
import ItinerarysService from '@/services/ItinerarysService'
import TripImagesService from '@/services/TripImagesService'
import JoinTripsService from '@/services/JoinTripsService'
import NotificationsService from '@/services/NotificationsService'
import router from '../router'

  export default {
    data: () => ({
      form: false,
      loading: false,
      snackbar: false,
      timeout: 2000,
      activeImg: 0,
      loadingOverlay: false,
      loadingOverlayMSG: "",
      diableOverlay:true,

      tripID: "",
      URL: "",
      title: null,
      cost: null,
      decription: null,
      to: null,
      from: null,
      nights: null,
      days: null,
      location : null,
      imgURL: "",
      tripimgs: [],
      deleteImgURLs:[],
      addImgURLs:[],
      itenary: "",
      dayIt: "",
      itenarys: [],
      deleteItenarys: [],
      addItenarys: [],
      snackbarMsg: "",
      locName: "",
      hotelName: "",
      locOverlay: false,
      hotelOverlay: false,
      createLocIMG: "",
      createLoc: "",
      createLocDes: "",
      createHotelname: "",
      createHotelIMG: "",
      allLoc: [],
      allHotel: [],
      getTripDetailsCount: 0,
      addLocAry: [],
      addHotelAry: [],
      showLoc: [],
      showHtl: [],
      lochtlOverlay: false,
      joinedUsers: []
    }),

    methods: {
      addImg(){
        if(this.imgURL != ""){
          this.tripimgs.push({
                id: "",
                url: this.imgURL
              })
          this.addImgURLs.push(this.imgURL)
          this.imgURL = ""
        }
      },
      deleteImg(imgAry) {
        console.log("delete image" + imgAry.id)
        this.tripimgs.splice(this.tripimgs.indexOf(imgAry), 1);
        if(imgAry.id != ""){
          this.deleteImgURLs.push(imgAry.id)
        }
        else{
          //if no id mean its added Img so remove from addIt array
          this.addImgURLs.splice(this.addImgURLs.indexOf(imgAry), 1);
        }
      },

      addItenary(){
        if(this.dayIt != "" && this.itenary != ""){
          this.itenarys.push({
                id: "",
                day: this.dayIt,
                activity: this.itenary,
                locationID: this.locName,
                hotelID: this.hotelName,
                data: "Day " + this.dayIt + ": " + this.itenary
              })
          this.addItenarys.push({
                day: this.dayIt,
                activity: this.itenary,
                locationID: this.locName,
                hotelID: this.hotelName,
              })
          this.itenary = ""
          this.dayIt = ""
          this.locName = ""
          this.hotelName = ""
          this.addLocAry = []
          this.addHotelAry = []
        }
        else{
          this.showSnackles("Please fill day and location to add Itinerary.")
        }
      },
      deleteItenary(delItenary) {
          console.log("del click: "+ delItenary)
          this.itenarys.splice(this.itenarys.indexOf(delItenary), 1);
          if(delItenary.id != ""){
            this.deleteItenarys.push(delItenary.id)
          }
          else{
            //if no id mean its added IT so remove from addIt array
            this.addItenarys.splice(this.addItenarys.indexOf(delItenary), 1);
          }
      },

      getTripID(){
        this.tripID = this.$store.state.editTripId
        console.log("Edit trip: " + this.tripID)
      },

      async GetTripsDetails(){
        await TripsService.getTrip({
            tripID: this.tripID
          }).then((response)=>{
          this.trips = response.data
          this.title = this.trips.tripTitle
          this.location = this.trips.location
          this.cost = this.trips.costperperson
          this.days = this.trips.days
          this.nights = this.trips.nights
          this.decription = this.trips.description
          this.from = this.trips.fromdate
          this.to = this.trips.todate
          this.URL = this.trips.thumbnailURL
          
          this.getTripDetailsCount = this.getTripDetailsCount + 1
        })
        console.log("Trip Details : "+this.trips)

      },
      async GetItinerarysDetails(){
        this.loadingOverlay = true
        await ItinerarysService.getItinerarys({
            tripID: this.tripID
          }).then((response)=>{
            console.log("Itinerary" + response)
            response.data.forEach(element => {
              console.log(element)
              this.itenarys.push({
                id: element.id,
                day: element.day,
                activity: element.activity,
                locationID: element.locationID,
                hotelID: element.hotelID,
                data: "Day " + element.day + ": " + element.activity
              })
            });
            this.getTripDetailsCount = this.getTripDetailsCount + 1
        })
      },
      async GetTripImagesDetails(){
        await TripImagesService.getTripImages({
            tripID: this.tripID
          }).then((response)=>{
            console.log("Trip imgs: "+response)
            response.data.forEach(element => {
              console.log(element)
              this.tripimgs.push({
                id: element.id,
                url: element.ImageURL
              })
            });
            console.log("img after push: "+this.tripimgs)
            this.getTripDetailsCount = this.getTripDetailsCount + 1
        })

      },
      async UpdateTripDetails(){
          this.loadingOverlay = true
          await TripsService.UpdateTrip({
            id: this.tripID,
            tripTitle: this.title,
            location: this.location,
            days: this.days,
            nights: this.nights,
            costperperson: this.cost,
            fromdate: this.from,
            todate: this.to,
            description: this.decription,
            thumbnailURL: this.URL 
          }).then((response)=>{
            console.log("Itinerary" + response)
            response.data.forEach(element => {
              console.log(element)
            });
            this.sendNotification()
            this.showSnackles("Trip details updated succesfully.")
            this.loadingOverlay = false
        })
      },
      UpdateItinerarys(){
        //delete IT
        this.deleteItenarys.forEach(element => {
          this.delItinerary(element)
        });
        //add IT
        this.addItenarys.forEach(element => {
          this.addItinerary(element)
        });
        this.sendNotification()
      },
      async delItinerary(ItId){
        this.loadingOverlay = true
        await ItinerarysService.deleteItinerarys({
            id: ItId
          }).then((response)=>{
            console.log("Itinerary" + response)
            this.showSnackles("Itinerary(s) DELETED succesfully.")
            this.loadingOverlay = false
        })
      },
      async addItinerary(itObj){
        this.loadingOverlay = true
        await ItinerarysService.addItinerary({
            day: itObj.day,
            activity: itObj.activity,
            locationID: itObj.locationID,
            hotelID: itObj.hotelID,
            tripID: this.tripID
          }).then((response)=>{
            console.log("Itinerary" + response)
            this.showSnackles("Itinerary details updated succesfully.")
            this.loadingOverlay = false
        })
      },
      UpdateImg(){
        console.log("del ary: "+this.deleteImgURLs)
        this.deleteImgURLs.forEach(element => {
          console.log(element)
          this.delTripImg(element)
        });
        this.addImgURLs.forEach(elementadd => {
          console.log("add: "+elementadd)
          this.addTripImg(elementadd)
        });
        this.sendNotification()
      },
      async delTripImg(ImgId){
        this.loadingOverlay = true
        console.log("add: "+ImgId)
        await TripImagesService.deleteTripImages({
            id: ImgId
          }).then((response)=>{
            console.log("TripIMG" + response)
            this.showSnackles("Trip image(s) DELETED succesfully.")
            this.loadingOverlay = false
        })
      },
      async addTripImg(imgURL){
        this.loadingOverlay = true
        console.log(imgURL)
        await TripImagesService.addTripImages({
            ImageURL: imgURL,
            tripID: this.tripID
          }).then((response)=>{
            console.log("TripIMG" + response)
            this.showSnackles("Trip images updated succesfully.")
            this.loadingOverlay = false
        })
      },
      showSnackles(message){
        this.snackbarMsg = message
        this.snackbar = true
      },
      showLocationOverLay(){
        this.locOverlay = !this.locOverlay
        //this.loadingOverlay = true
        //this.allLoc = []
        //this.getLocation()
      },
      showHotelOverLay(){
        this.hotelOverlay = !this.hotelOverlay
        //this.loadingOverlay = true
        //this.allHotel = []
        //this.getHotel()
      },
      async createLocation(){
        if(this.createLoc != "" && this.createLocIMG != null){
        this.loadingOverlay = true
          await ItinerarysService.addLocation({
            Address: this.createLoc,
            Description: this.createLocDes,
            ImageURL: this.createLocIMG
          }).then((response)=>{
            console.log("create Location: " + response)
            this.showSnackles("Location added succesfully.")
            this.allLoc.push({
              "id" : response.data.id,
              "Address" : response.data.Address,
              "Description" : response.data.Description,
              "ImageURL" : response.data.ImageURL
            })
            if(this.locName != ""){
              this.locName = this.locName + "," + response.data.id
            }
            else{
              this.locName = response.data.id
            }
            this.addLocAry.push({
              "Address" : this.createLoc,
              "Description" : this.createLocDes,
              "ImageURL" : this.createLocIMG
            })
            this.createLoc = ""
            this.createLocDes = ""
            this.createLocIMG = ""
            
            this.loadingOverlay = false
            this.locOverlay = !this.locOverlay
          })
        }
          else{
            this.showSnackles("Please Fill Location and Location image URL to continue.")
          }
      },
      async createHotel(){
        if(this.createHotelname != "" && this.createHotelIMG != ""){
          this.loadingOverlay = true
          await ItinerarysService.addHotel({
            HotelName: this.createHotelname,
            ImageURL: this.createHotelIMG
          }).then((response)=>{
            console.log("Create Hotel: " + response)
            this.showSnackles("Hotel added succesfully.")
            this.allHotel.push({
              "id" : response.data.id,
              "HotelName" : response.data.HotelName,
              "ImageURL" : response.data.ImageURL
            })
            if(this.hotelName != ""){
              this.hotelName = this.hotelName + "," + response.data.id
            }
            else{
              this.hotelName = response.data.id
            }
            this.addHotelAry.push({
              "HotelName" : this.createHotelname,
              "ImageURL" : this.createHotelIMG
            })
            this.createHotelname = ""
            this.createHotelIMG = ""
            this.loadingOverlay = false
            this.hotelOverlay = !this.hotelOverlay
          })
        }
        else{
          this.showSnackles("Please Fill Hotel Name and Hotel image URL to continue.")
        }
      },
      async getLocation(){
        await ItinerarysService.getLocation().then((response)=>{
            console.log("get Location: " + response.data)
            response.data.forEach(element => {
              this.allLoc.push(element)
            });
            this.loadingOverlay = false
        })
      },
      async getHotel(){
        await ItinerarysService.getHotels().then((response)=>{
            console.log("get Hotel: " + response.data)
            response.data.forEach(element => {
              this.allHotel.push(element)
            });
            this.loadingOverlay = false
        })
      },
      addLocationFromList(location){
        this.addLocAry.push({
          "Address" : location.Address,
          "Description" : location.Description,
          "ImageURL" : location.ImageURL
        })
        if(this.locName != ""){
          this.locName = this.locName + "," + location.id
        }
        else{
          this.locName = location.id
        }
        this.locOverlay = !this.locOverlay
      },
      addHotelFromList(hotel){
        if(this.hotelName != ""){
          this.hotelName = this.hotelName + "," + hotel.id
        }
        else{
          this.hotelName = hotel.id
        }
        this.addHotelAry.push({
          "HotelName" : hotel.HotelName,
          "ImageURL" : hotel.ImageURL
        })
        this.hotelOverlay = !this.hotelOverlay
      },
      clearItineraryAdd(){
        this.dayIt = ""
        this.itenary = ""
        this.locName = ""
        this.hotelName = ""
        this.addLocAry = []
        this.addHotelAry = []
      },
      showAddedLocAndHotels(locs ,hotels){
        this.showLoc = []
        this.showHtl = []
        console.log("Locations : " + locs + "  Hotels: " + hotels)
        console.log("locations count: " + this.allLoc.length + "  Hotels count: " + this.allHotel.length)
        if(locs.toString().length > 0){
          locs.toString().split(",").forEach(element => {
            var loc = this.allLoc.filter((location) => {
              return location.id == element
            })
            if(loc.length > 0){
              this.showLoc.push(loc[0])
            }
          });
        }
        
        if(hotels.toString().length > 0){
          hotels.toString().split(",").forEach(element => {
            var hot = this.allHotel.filter((hotelTemp) => {
              return hotelTemp.id == element
            })
            if(hot.length > 0){
              this.showHtl.push(hot[0])
            }
          });
        }
        this.lochtlOverlay = !this.lochtlOverlay
      },
      async getJoinedUsers(){
        console.log(this.tripID)
        await JoinTripsService.getJoinedTripUsers(this.tripID).then((response)=>{
          response.data.forEach(element => {
            this.joinedUsers.push(element.userID)
          });
        })
      },
      sendNotification(){
        this.joinedUsers.forEach(element => {
          this.addNotification(element)
        });
      },
      async addNotification(userID){
        console.log(userID)
        await NotificationsService.addNotifications({
          tripID : this.tripID,
          userID: userID,
          tripName: this.title,
          action: "change"
        })
      },
      async deleteTrip(){
        this.loadingOverlay = true
        this.loadingOverlayMSG = "Deleting..."
        console.log(this.tripID)
        await TripsService.deleteTrip(this.tripID).then(()=>{
          this.loadingOverlayMSG = "Redirecting..."
          this.loadingOverlay = false
          router.push("/")
        })
      }
    },
    watch: {
      getTripDetailsCount: function(){
        if(this.getTripDetailsCount >= 3){
          this.loadingOverlay = false
        }
      }
    },
    beforeMount() {
      this.loadingOverlay = true
      this.getTripID()
      this.GetTripsDetails()
      this.GetItinerarysDetails()
      this.GetTripImagesDetails()
      this.getLocation()
      this.getHotel()
      this.getJoinedUsers()
    }
  }
</script>
