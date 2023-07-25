import Api from '@/services/Api'

export default{
    getConfigs () {
        return Api().get('/configs')
    },
    addConfig (req) {
        return Api().post('/config', req)
    },
    updateConfig (req, id){
        return Api().put('/config/'+ id, req)
    }
}
