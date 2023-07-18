import Api from '@/services/Api'

export default{
    getAllCustomers () {
        return Api().get('/allCustomers')
    },
    addCustomer (req) {
        return Api().post('/addCustomer', req)
    },
    deleteCustomer (custID) {
        return Api().delete('/customer/'+custID)
    }
}
