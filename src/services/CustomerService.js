import Api from '@/services/Api'

export default{
    getAllCustomers () {
        return Api().get('/customers')
    },
    addCustomer (req) {
        return Api().post('/customer', req)
    },
    deleteCustomer (custID) {
        return Api().delete('/customer/'+custID)
    }
}
