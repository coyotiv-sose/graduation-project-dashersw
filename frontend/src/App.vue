<script>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { useAccountStore } from './stores/account'
import { useSocketStore } from './stores/socket'

import { mapActions, mapState } from 'pinia'

export default {
  name: 'App',
  components: {
    HelloWorld,
    RouterLink,
    RouterView
  },
  async mounted() {
    await this.fetchUser()
    await this.init()
  },
  methods: {
    ...mapActions(useAccountStore, ['fetchUser', 'logout']),
    ...mapActions(useSocketStore, ['init'])
  },
  computed: {
    ...mapState(useAccountStore, ['user']),
    ...mapState(useSocketStore, ['connected'])
  }
}
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/picnics">Picnics</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink v-if="!user" to="/login">Log in</RouterLink>
        <RouterLink v-if="!user" to="/signup">Sign up</RouterLink>
        <a v-if="user" @click="logout">Log out</a>
      </nav>
    </div>
  </header>
  <h1>Picnigram for {{ user?.name }}. Socket connected: {{ connected ? 'yes' : 'no' }}</h1>
  <p>{{ time }}</p>
  <Suspense>
    <RouterView />
  </Suspense>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
