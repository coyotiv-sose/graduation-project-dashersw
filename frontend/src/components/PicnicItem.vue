<script>
export default {
  name: 'PicnicItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>
<template lang="pug">
div
  input(type="checkbox", :checked="item.isEnough")
  | {{item.name}} ({{item.quantity}}/{{item.desiredQuantity}})
  ul
    li(v-for="whoIsBringingWhat in item.whoIsBringingWhat" :key="whoIsBringingWhat._id") {{whoIsBringingWhat.user.name}} is bringing {{whoIsBringingWhat.quantity}} {{item.name}}s.
</template>
