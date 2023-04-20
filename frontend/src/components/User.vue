<script>
export default {
  name: 'User',
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<template lang="pug">
span {{ user.name }}
</template>
