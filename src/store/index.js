import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tagList:[],
    IsLogin:false,
    IsLogout:true,
    vertoState:'',
    info:{}
  },
  mutations: {
    SET_TAG (state,list){
      state.tagList = list
    },
    DEL_TAG (state,tag){
      state.tagList = tag
    },
    vertoState(state,str){
      state.vertoState = str
    },
    IsLogin(state,str){
      state.IsLogin = str
    },
    IsLogout(state,str){
      state.IsLogout = str
    },
    setInfo(state,obj){
      state.info = obj
    },
  },
  actions: {
    addTag ({commit},list){
      commit('SET_TAG',list)
    },
    delTag ({commit},tag){
      commit('DEL_TAG',tag)
    },
  },
  modules: {
  }
})
