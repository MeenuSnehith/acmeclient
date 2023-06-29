import Api from '@/services/Api'

export default{
    getAllCustomers () {
        return Api().get('/getAllCustomers')
    },
    addCustomer (req) {
        return Api().post('/addCustomer', req)
    },
    deleteCustomer (custID) {
        return Api().delete('/deleteCustomer/'+custID)
    }
}
