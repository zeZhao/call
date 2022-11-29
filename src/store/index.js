import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tagList:[]
  },
  mutations: {
    SET_TAG (state,list){
      state.tagList = list
    },
    DEL_TAG (state,tag){
      state.tagList = tag
    }
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
