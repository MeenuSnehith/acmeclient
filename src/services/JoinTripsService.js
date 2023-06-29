import Api from '@/services/Api'

export default{
    addJoinedTrip (tripDetails) {
        return Api().post('/addjoinedtrip', tripDetails)
    },
    getAllJoinedTrips (tripDetails) {
        return Api().post('/getjoinedtrips', tripDetails)
    },
    getAllRequestedTrips () {
        return Api().get('/getRequestedtrip')
    },
    getJoinedTripUsers (tripID) {
        return Api().get('/getjoinedtripusers/' + tripID)
    },
    checkIsJoinedTrips (tripDetails) {
        return Api().post('/checkisjoinedtrips',tripDetails)
    },
    updateStatus (id,statusDetailsk) {
        return Api().put('/updatejoinedtrip/' + id,statusDetailsk)
    }
}
