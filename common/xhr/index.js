import axios from 'axios'

axios.defaults.timeout = 50000;//超时
axios.defaults.baseURL = '';//请求接口域名
axios.defaults.transformRequest = [(data) => {
    let str = []
    for (let i in data) {
        str.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]))
    }
    return str.join('&')
}]

// http request 拦截器
axios.interceptors.request.use(
    config => {
        return config
    },
    error => {
        return Promise.reject(error)
    })

// http response 拦截器
axios.interceptors.response.use(
    response => {
        //axios.defaults.headers['token'] = ''; 在header保存token
        return response.data
    },
    error => {
        return Promise.reject(error.response.data)
    })

export default axios
