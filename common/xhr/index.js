import axios from 'axios'

/**
 * Axios 是一个基于 promise 的 HTTP 库
 * 默认配置为get方法，get方法用params传参，post方法用data传参
 * 更多详细配置请看：https://www.kancloud.cn/yunye/axios/234845
 */

// axios 配置
axios.defaults.timeout = 50000
axios.defaults.baseURL = ''
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
    return response.data
  },
  error => {
    return Promise.reject(error.response.data)
  })

export default axios
