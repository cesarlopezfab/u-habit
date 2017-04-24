import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import axios from 'axios';
import moment from 'moment';


Vue.use(Vuex);

Vue.filter('date', function (value) {
    return moment(value).format('DD/MM/YYYY');
});

const store = new Vuex.Store({
    state: {
        weight: undefined,
        created: undefined,
        user: undefined,
        weights: []
    },
    getters: {
        weights: state => {
            return state.weights;
        }
    },
    mutations: {
        updateWeight (state, value) {
            state.weight = value;
        },
        updateCreated (state, value) {
            state.created = value;
        },
        updateWeights (state, weights) {
            state.weights = weights;
            state.weights.sort(function (a, b) {
                if (a.created < b.created) {
                    return 1;
                } else {
                    return -1;
                }
            });
        },
        reset (state) {
            state.weight = undefined;
            state.created = undefined;
        },
        user (state, value) {
            state.user = value;
        }
    },
    actions: {
        persistWeight (context) {
            let date;

            if (context.state.created !== undefined) {
                date = moment(context.state.created, 'DD/MM/YYYY');
            }

            axios.post('/api/weights', {
                value: context.state.weight,
                created: date
            }).then(function () {
                context.commit('reset');
                context.dispatch('retrieveWeights');
            });

        },
        removeWeight (context, weight) {
            axios.delete('/api/weights/' + weight.id, {data: weight}).then(function () {
                context.dispatch('retrieveWeights');
            });
        },
        retrieveWeights (context) {
            axios.get('/api/weights').then(function (response) {
                context.commit('updateWeights', response.data);
            });
        },
        loggedIn (context, payload) {
            if (!payload) {
                payload = {
                    accessToken: localStorage.getItem('accessToken'),
                    profile: localStorage.getItem('profile')
                }
            }
            localStorage.setItem('profile', payload.profile);
            localStorage.setItem('accessToken', payload.accessToken);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + payload.accessToken;

            context.commit('user', payload.profile);
        },
        logout(context) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('profile');
            context.commit('user', undefined);
        }
    }
});

const vm = new Vue({
    el: '#app',
    render: h => h(App),
    store
});

window.store = store;
window.vm = vm;

store.dispatch('retrieveWeights');