import Api from '@/services/Api'

export default{
    addNotifications (details) {
        return Api().post('/addnotification', details)
    },
    getAllNotifications (details) {
        return Api().get('/getnotifications/' + details)
    }
}
