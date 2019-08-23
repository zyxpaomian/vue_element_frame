import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)

const state = {
  isAuthenticate: false,
  //username: '',
  username: window.localStorage.getItem('username'),
  //role: '',
  role: window.localStorage.getItem('role'),
  //token: '',
  token: window.localStorage.getItem('token'),
  //allroutes: []
  allroutes: window.localStorage.getItem('allroutes'),
  // logintime : ''
  // logintime: window.localStorage.getItem('logintime'),
  passtime: window.localStorage.getItem('passtime')

}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})