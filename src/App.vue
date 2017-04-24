<template>
    <div id="app">
        <authentication></authentication>
        <div>
            <label>Add your weight</label>
            <input type="number" placeholder="U Weight" v-model="weight">
            <input type="text" placeholder="dd/mm/yyyy (optional)" v-model="created">
            <button @click="addWeight">Add</button>
        </div>

        <div>
            <h1>Weight History</h1>
            <ul>
                <li v-for="w in weights">
                    <span>{{ w.value }}</span><span> - </span><span>{{ w.created | date }}</span><span><button @click="remove(w)">remove</button></span>
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

<style{{#sass}} lang="scss"{{/sass}}>
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