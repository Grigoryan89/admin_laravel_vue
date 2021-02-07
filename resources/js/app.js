


require('./bootstrap');

window.Vue = require('vue');
import { Form,HasError,AlertError } from 'vform';

window.Form = Form;
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

import VueRouter from 'vue-router'

Vue.use(VueRouter)

let routes = [
    { path: '/profile', component:  require('./components/Profile.vue').default },
    { path: '/users', component:  require('./components/Users.vue').default },
    { path: '/dashboard', component: require('./components/Dashboard.vue').default }
]

const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})



Vue.component('example-component', require('./components/Profile.vue').default);
Vue.component('example-component', require('./components/Users.vue').default);
Vue.component('example-component', require('./components/Dashboard.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    router
});
