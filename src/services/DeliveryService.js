import Api from '@/services/Api'

export default{
    getAllDeliverys () {
        return Api().get('/allDeliverys')
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
    assignDelivery (req, id) {
        return Api().put('/assignDelivery/'+ id, req)
    },
    deleteDelivery (id) {
        return Api().delete('/delivery/'+ id)
    }
}
