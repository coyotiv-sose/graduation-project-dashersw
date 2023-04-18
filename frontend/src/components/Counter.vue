<script setup>
import { ref } from 'vue'

defineProps({
  name: {
    type: String,
    required: true
  }
})

const count = ref(0)

const increment = () => {
  count.value++
}

const decrement = () => {
  count.value--
}
</script>

<template lang="pug">
div
  h1 {{ name }}
  p Count: {{ count }}
  button(@click='increment') Increment
  button(@click='decrement') Decrement
</template>
