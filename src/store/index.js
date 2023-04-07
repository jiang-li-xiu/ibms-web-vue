/*
 * @Author       : Imor
 * @Date         : 2021-08-19 09:27:34
 * @LastEditTime : 2021-08-23 10:41:17
 * @LastEditors  : Imor
 * @FilePath     : \ibms-web-vue\src\store\index.js
 * @Description  : 
 */
import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import getters from './getters'
import unityInfo from './modules/unityInfo'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    permission,
    settings,
    unityInfo
  },
  getters
})

export default store