import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routes from './config/routes'
import store from './config/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import Vuex from 'vuex'
import 'font-awesome/css/font-awesome.min.css'
import promise from 'es6-promise'

Vue.use(VueRouter)
Vue.use(ElementUI)
//Vue.use(Vuex)

promise.polyfill() //用来兼容IE

const router = new VueRouter({
    mode: 'hash',
    base: '/', 
    routes: routes
})

router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        sessionStorage.removeItem('user');
    }
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (!user && to.path != '/login') {
        next({ path: '/login' })
    } else {
        next()
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')


