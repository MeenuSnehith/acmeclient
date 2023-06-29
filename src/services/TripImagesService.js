import Api from '@/services/Api'

export default{
    addTripImages (tripImagesDetails) {
        return Api().post('/addTripImages', tripImagesDetails)
    },
    getTripImages (tripImagesDetails) {
        return Api().post('/getTripImages', tripImagesDetails)
    },
    deleteTripImages (tripImagesDetails) {
        return Api().post('/deleteTripImages', tripImagesDetails)
    }
}
