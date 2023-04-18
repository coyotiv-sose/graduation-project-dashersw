<script>
export default {
  name: 'Counter',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    }
  }
}
</script>

<template lang="pug">
div
  h1 {{ name }}
  p Count: {{ count }}
  button(@click='increment') Increment
  button(@click='decrement') Decrement
</template>
