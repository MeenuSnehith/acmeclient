import Api from '@/services/Api'

export default{
    addTrip (tripDetails) {
        return Api().post('/addtrip', tripDetails)
    },
    getAllTrips () {
        return Api().get('/gettrips')
    },
    getTrip (trip) {
        return Api().post('/gettrip', trip)
    },
    UpdateTrip (trip) {
        return Api().post('/updatetrip', trip)
    },
    getAllJoinedTrips (trip) {
        return Api().post('/getjoinedtripdetails', trip)
    },
    deleteTrip (tripID) {
        return Api().delete('/deletetripdetails/' + tripID)
    }
}
