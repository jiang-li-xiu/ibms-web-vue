/*
 * @Author: Yelucc
 * @Date: 2021-06-16 11:22:28
 * @LastEditors: MJ
 * @LastEditTime: 2021-10-21 14:46:12
 * @Description:
 */
import Vue from "vue";

import Cookies from "js-cookie";
import $ from "jquery";
import Element from "element-ui";
import "./assets/styles/element-variables.scss";
import "./assets/icons/ICONFONT/iconfont.css";

import "@/assets/styles/index.scss"; // global css
import "@/assets/styles/ruoyi.scss"; // ruoyi css
import "@/assets/styles/flex.css";
import App from "./App";
import store from "./store";
import router from "./router";
import permission from "./directive/permission";
import { download } from "@/utils/request";
import "babel-polyfill";
import "event-source-polyfill";

import "./assets/icons"; // icon
import "./permission"; // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import {
    print,
    parseTime,
    resetForm,
    addDateRange,
    selectDictLabel,
    selectDictLabels,
    handleTree,
} from "@/utils/ruoyi";
import Pagination from "@/components/Pagination";
// 自定义表格工具扩展
import RightToolbar from "@/components/RightToolbar";
// 头部标签插件
import VueMeta from "vue-meta";
// JSON数据展示插件
import JsonViewer from "vue-json-viewer";
import winNotify from "@/utils/winNotify";
// stomp
// import Stomp from 'stompjs'
import dataV from "@jiaminghi/data-view";
// 全局方法挂载
Vue.prototype.getDicts = getDicts; // 获取字典数据
Vue.prototype.getConfigKey = getConfigKey;
Vue.prototype.parseTime = parseTime; // 日期处理
Vue.prototype.resetForm = resetForm;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.selectDictLabel = selectDictLabel; // 字典翻译
Vue.prototype.selectDictLabels = selectDictLabels;
Vue.prototype.download = download; // 下载
Vue.prototype.handleTree = handleTree;
Vue.prototype.winNotify = winNotify;

Vue.prototype.print = print; // 表格打印
// 在Array原型上构建一个删除数组指定元素的方法
// Array.prototype.remove = function (val) {
//   let index = this.indexOf(val);
//   if (index > -1) {
//     this.splice(index, 1);
//   }
// };
Vue.prototype.msgSuccess = function(msg) {
    this.$message({ showClose: true, message: msg, type: "success" });
};

Vue.prototype.msgError = function(msg) {
    this.$message({ showClose: true, message: msg, type: "error" });
};

Vue.prototype.msgInfo = function(msg) {
    this.$message.info(msg);
};

// 全局组件挂载
Vue.component("Pagination", Pagination);
Vue.component("RightToolbar", RightToolbar);

Vue.use(permission);
Vue.use(VueMeta);
Vue.use(JsonViewer);
// Vue.use(Stomp)
Vue.use(dataV);
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
    size: Cookies.get("size") || "medium", // set element-ui default size
});

Vue.config.productionTip = false;

new Vue({
    el: "#app",
    router,
    store,
    render: (h) => h(App),
});