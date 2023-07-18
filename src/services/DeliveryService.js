import Api from '@/services/Api'

export default{
    getAllDeliverys () {
        return Api().get('/deliverys')
    },
    addDelivery (req) {
        return Api().post('/addDelivery', req)
    },
    getlDeliveryByID (id) {
        return Api().get('/deliveryById/' + id)
    },
    getlDeliverysByUser (id) {
        return Api().get('/deliveryByUser/' + id)
    },
    updateDelivery (req, id){
        return Api().put('/deliveryUpdate/'+ id, req)
    },
    deleteDelivery (id) {
        return Api().delete('/delivery/'+ id)
    },
    getShortestPath (data) {
        return Api().post('/shortestPath', data)
    }
}
