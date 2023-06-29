import Api from '@/services/Api'

export default{
    getAllDeliverys () {
        return Api().get('/getAllDeliverys')
    },
    addDelivery (req) {
        return Api().post('/addDelivery', req)
    }
}
