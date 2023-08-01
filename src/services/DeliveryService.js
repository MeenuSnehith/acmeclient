import Api from '@/services/Api'

export default{
    getAllDeliverys () {
        return Api().get('/deliverys')
    },
    addDelivery (req) {
        return Api().post('/delivery', req)
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
    },
    getInvoiceByID (data) {
        return Api().post('/customerReportByID', data)
    },
    getInvoices (data) {
        return Api().post('/customerReports', data)
    },
    getReport (data) {
        return Api().post('/deliveryReportByID', data)
    }
}
