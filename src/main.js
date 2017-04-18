import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import axios from 'axios';
import moment from 'moment';
import Auth0Lock from 'auth0-lock';


// Initiating our Auth0Lock
var lock = new Auth0Lock(
  'Wtq452j6Mol0PREuCpsLdNmZzrjJxqgP',
  'cesarlopezfa.eu.auth0.com',
  {
    auth: {
      params:{
        audience: 'https://weight-u.herokuapp.com/'
      }
    }
  }
);

// Listening for the authenticated event
lock.on("authenticated", function(authResult) {
  // Use the token in authResult to getUserInfo() and save it to localStorage
  lock.getUserInfo(authResult.accessToken, function(error, profile) {
    if (error) {
      // Handle error
      return;
    }

    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('profile', JSON.stringify(profile));
  });
});


Vue.use(Vuex);

Vue.filter('date', function(value) {
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
            state.weights.sort(function(a, b) {
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
          console.log(state.user.nickname);
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
            }).then(function() {
                context.commit('reset');
                context.dispatch('retrieveWeights');
            });

        },
        removeWeight (context, weight) {
            axios.delete('/api/weights/' + weight.id, {data: weight}).then(function() {
                context.dispatch('retrieveWeights');
            });
        },
        retrieveWeights (context) {
            axios.get('/api/weights').then(function(response) {
                context.commit('updateWeights', response.data);
            });
        },
        login () {
          lock.show();
        },
        loggedIn(context) {
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('accessToken');
          context.commit('user', JSON.parse(localStorage.getItem('profile')));
        }
    }
});

const vm = new Vue({
        el: '#app',
        render: h => h(App),
        store
});

var token = localStorage.getItem('accessToken');
if (token) {
  store.dispatch('loggedIn');
}

window.store = store;
window.vm = vm;

store.dispatch('retrieveWeights');