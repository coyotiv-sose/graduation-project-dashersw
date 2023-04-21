<script>
import axios from 'axios'
import { mapActions } from 'pinia'
import { useAccountStore } from '../stores/account'

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    ...mapActions(useAccountStore, ['login']),
    async doLogin() {
      await this.login(this.email, this.password)
      this.$router.push('/')
    }
  }
}
</script>

<template lang="pug">
h2 Log in to Picnigram

form(@submit.prevent="doLogin")
  div
    label(for="email") Email:
    input#email(v-model="email" type="text" required)

  div
    label(for="password") Password:
    input#password(v-model="password" type="password" required)

  button(type="submit") Log in
</template>
