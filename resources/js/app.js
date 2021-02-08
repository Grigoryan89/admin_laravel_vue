


require('./bootstrap');

window.Vue = require('vue');
import { Form,HasError,AlertError } from 'vform';
import moment from 'moment';

window.Form = Form;
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)


Vue.filter('upText' ,function (text){
    return text.charAt(0).toUpperCase() + text.slice(1)
});
Vue.filter('myDate' ,function (created){
    return moment(created).format('MMMM Do YYYY');
});


import VueRouter from 'vue-router'
Vue.use(VueRouter)

window.Fire = new Vue()


import swal from 'sweetalert2'
window.swal = swal

const toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', swal.stopTimer)
        toast.addEventListener('mouseleave', swal.resumeTimer)
    }
});

window.toast = toast;



import VueProgressBar from 'vue-progressbar'
Vue.use(VueProgressBar, {
    color: 'rgb(143, 255, 199)',
    failedColor: 'red',
    height: '2px'
})

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
