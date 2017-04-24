<template>
    <div>
        <button @click="login()" v-show="!authenticated">Login</button>
        <button @click="logout()" v-show="authenticated">Logout</button>
    </div>
</template>

<script>
    import Auth0Lock from 'auth0-lock';
    import axios from 'axios';

    export default {
        data() {
            return {
                authenticated: false,
                secretThing: '',
                lock: new Auth0Lock('Wtq452j6Mol0PREuCpsLdNmZzrjJxqgP',
                    'cesarlopezfa.eu.auth0.com', {
                        auth: {
                            params: {
                                audience: 'https://weight-u.herokuapp.com/',
                                scope: 'openid name email nickname username'
                            }
                        }
                    })
            }
        },
        mounted() {
            let self = this;

            this.authenticated = this.checkAuth();

            this.lock.on('authenticated', (authResult) => {
                let accessToken = authResult.accessToken;
                localStorage.setItem('accessToken', authResult.accessToken);
                self.lock.getUserInfo(accessToken, (error, profile) => {
                    if (error) {
                        // Handle error
                        return;
                    }
                    self.authenticated = true;
                    self.$store.dispatch('loggedIn', {
                        accessToken,
                        profile
                    });
                });
            });

            this.lock.on('authorization_error', (error) => {
                // handle error when authorizaton fails
            });
        },
        methods: {
            login() {
                this.lock.show();
            },
            checkAuth() {
                let token = localStorage.getItem('accessToken');
                if (token) {
                    this.$store.dispatch('loggedIn');
                    return true;
                }
                return false;
            },
            logout() {
                this.$store.dispatch('logout');
                this.authenticated = false;
            }
        }
        }

</script>

<style></style>