<template>
    <div id="app" class="content">
        <authentication></authentication>
        <div class="columns">
            <b-field class="column" label="Add your weight">
                <b-input v-model="weight"></b-input>
            </b-field>
            <b-field class="column" label="Date (optional)">
                <b-input placeholder="dd/mm/yyyy" v-model="created"></b-input>
            </b-field>

            <button class="control column button is-primary" @click="addWeight">Add</button>
        </div>

        <div>
            <h2>Weight History</h2>
            <ul>
                <li class="tile" v-for="w in weights">
                    <div class="card">
                        <span class="tag">{{ w.value }} - {{ w.created | date }}<button class="delete is-small" @click="remove(w)"></button></span>
                    </div>

                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import Authentication from './Authentication.vue';
    export default {
        name: 'app',
        computed: {
            weight: {
                get () {
                    return this.$store.state.weight
                },
                set (value) {
                    this.$store.commit('updateWeight', value)
                }
            },
            created: {
                get () {
                    return this.$store.state.created
                },
                set (value) {
                    this.$store.commit('updateCreated', value)
                }
            },
            weights () {
                return this.$store.getters.weights
            }
        },
        methods: {
            toast() {
                this.$toast.open('Something happened')
            },
            addWeight () {
                this.$store.dispatch('persistWeight');
            },
            remove (weight) {
                this.$store.dispatch('removeWeight', weight);
            },
            login () {
                this.$store.dispatch('login');
            }
        },
        components: {
            Authentication
        }
    }
</script>

<style{{#
sass}} lang="scss"{{/
sass}}>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>