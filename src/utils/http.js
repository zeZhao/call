import axios from "axios";
import Vue from 'vue'
import Api from "@/utils/api.js";
import { Message } from 'element-ui'
import { setStorage, getStorage } from "@/utils/auth";
import store from '@/store/index.js';
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  retry: 5,
  // withCredentials: true,
})

service.interceptors.request.use(
  config => {
    config.headers['token'] = getStorage('token')
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 500) {
      Message({
        message: res.msg || res.data || '系统异常，请联系管理员',
        type: 'error',
      })
    } else if (res.code === 9000) {
      setStorage("token")
      Message({
        message: '登录过期，请重新登录！',
        type: 'error',
      })
      Api.role.updateAttendAndLoginMode({
          attendId: JSON.parse(getStorage('info')).attendId,
          attendStatus: 4,
        })
      setTimeout(() => window.location.reload(), 2000);
    }
    return res
  },
  error => {
    Message({
      message: '系统异常，请联系管理员',
      type: 'error',
    })
    return Promise.reject(error)
  }
)

function request(url, method, data, isBlod = false) {
  let obj = {
    url,
    method,
    params: data,
    data,
  }
  if (method === 'get' || method === 'delete') {
    delete obj.data
    if (isBlod) {
      obj.responseType = 'blob'
    }
    return service(obj)
  }
  if (method === 'post' || method === 'put') {
    delete obj.params
    if (isBlod) {
      obj.responseType = 'blob'
    }
    return service(obj)
  }

}

export default request