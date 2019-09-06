import axios from 'axios'

axios.defaults.timeout = 10000
axios.defaults.baseURL = ''

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // const token = getCookie('名称');
    //config.data = JSON.stringify(config.data)
    const TOKEN = '4c6ed84fe2ba465db6933e82c114f9a6'
    config.headers = {
      'Content-Type': 'application/json',
      'Auth-Token': TOKEN
    }
    /* if(TOKEN) {
        config.headers['Auth-Token'] = TOKEN;
    } */
    // if(token){
    //   config.params = {'token':token}
    // }
    return config
  },
  error => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.errCode === 2) {
      router.push({
        path: '/login',
        querry: {redirect: router.currentRoute.fullPath}// 从哪个页面跳转
      })
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get (url, params = {}, errmsg) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        this.$message.error(errmsg)
        this.loading = false
        reject(err)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post (url, data = {}, errmsg) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        this.$message.error(errmsg)
        this.loading = false
        reject(err)
      })
  })
}
