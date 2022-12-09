import request from "./http"

export default {
  login:{
    login(params){
      return request('/attend/login','post',params)
    }
  }
}