<script setup>
import axios from 'axios'

import { RouterLink } from 'vue-router'

import Counter from '../components/Counter.vue'

import CounterOptionsApi from '../components/CounterOptionsApi.vue'

const { data: picnics } = await axios.get('http://localhost:3000/picnics')
</script>

<template lang="pug">
h2 Picnics
p Welcome to the picnic page!
p Here you can see all the picnics that have been created by users.

ul
  li(v-for="picnic in picnics" :key="picnic._id")
    RouterLink(:to="`/picnics/${picnic._id}`")
      | {{ picnic.name }} at {{ picnic.location }} on {{ picnic.date }}
    p {{ picnic.attendees.length }} people are attending
</template>
