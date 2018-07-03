import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import clipper from '../static/clipper'

Vue.config.productionTip = false

var VueTouch = require('vue-touch')
Vue.use(VueTouch, {name: 'v-touch'})
// 全局引入Toast
import './components/Toast/toast.css';
import Toast from './components/Toast/index';

// UI
import 'mint-ui/lib/style.css';
import Mint from 'mint-ui';
Vue.use(Mint);
Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(clipper)



Vue.use(Toast);
// 创建组建
import Home from './components/Home.vue'
import HeaderNew from './components/HeaderNew.vue'
import todoListItem from './components/todoListItem.vue'


import Header from './components/Header.vue'
import Other from './components/Other.vue'
import Login from './components/Login.vue'
import Details from './components/Details.vue'
import Pinglun from './components/Pinglun.vue'
import Register from './components/Register.vue'
import Find from './components/Find.vue'
import father from './components/father.vue'
import BigImg from './components/BigImg.vue'
import HeaderChange from './components/HeaderChange.vue'

import wcView from 'wc-view';
import 'wc-view/style.css';
Vue.use(wcView);


// 配置路由
 const routes = [
	{ path: '/home', component: Home ,name:"home"},
	{ path: '/todoListItem', component: todoListItem ,name:"todoListItem"},
	{ path: '/header', component: Header ,name:"header"},
	{ path: '/other', component: Other ,name:"other"},
	{ path: '/login', component: Login ,name:"login"},
	{ path: '/details', component: Details ,name:"details"},
	{ path: '/pinglun:aid', component: Pinglun ,name:"pinglun"},
	{ path: '/register', component: Register ,name:"register"},
	{ path: '/find', component: Find ,name:"find"},
	{ path: '/father', component: father ,name:"father"},
	{ path: '/BigImg', component: BigImg ,name:"BigImg"},
	{ path: '/HeaderNew', component: HeaderNew ,name:"HeaderNew"},
	{ path: '/HeaderChange', component: HeaderChange ,name:"HeaderChange"},
	{ path: '*', redirect: '/Home' }   /*默认跳转路由*/
]
// 实例化VueRouter
const router = new VueRouter({
  	routes // （缩写）相当于 routes: routes
})
// 挂载路由
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})




