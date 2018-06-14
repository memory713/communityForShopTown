import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import clipper from '../static/clipper'

Vue.config.productionTip = false

// UI
import 'mint-ui/lib/style.css'
import Mint from 'mint-ui';
Vue.use(Mint);
Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(clipper)
// 创建组建
import Home from './components/Home.vue'
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
	{ path: '/home', component: Home },
	{ path: '/header', component: Header },
	{ path: '/other', component: Other },
	{ path: '/login', component: Login },
	{ path: '/details', component: Details },
	{ path: '/pinglun:aid', component: Pinglun },
	{ path: '/register', component: Register },
	{ path: '/find', component: Find },
	{ path: '/father', component: father },
	{ path: '/BigImg', component: BigImg },
	{ path: '/HeaderChange', component: HeaderChange },
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




