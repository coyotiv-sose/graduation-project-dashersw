<script>
import axios from 'axios'

export default {
  name: 'PicnicDetail',
  data() {
    return {
      picnic: null
    }
  },
  async created() {
    const { data: picnic } = await axios.get(
      `http://localhost:3000/picnics/${this.$route.params.id}`
    )
    this.picnic = picnic
  }
}
</script>

<template lang="pug">
div(v-if="!picnic")
  p Loading...
div(v-else)
  h2 Picnic {{picnic.name}}

  h3 at {{picnic.location}} on {{picnic.date}}

  p {{picnic.attendees.length}} people are attending:

  ul
    li(v-for="attendee in picnic.attendees" :key="attendee._id") {{ attendee.name }}

  div(v-if="picnic.items.length === 0")
    p No items have been added to this picnic yet.
  div(v-else)
    p They will bring the following items:
    ul
      li(v-for="item in picnic.items" :key="item._id")
        input(type="checkbox", :checked="item.isEnough")
        | {{item.name}} ({{item.quantity}}/{{item.desiredQuantity}})
        ul
          li(v-for="whoIsBringingWhat in item.whoIsBringingWhat" :key="whoIsBringingWhat._id") {{whoIsBringingWhat.user.name}} is bringing {{whoIsBringingWhat.quantity}} {{item.name}}s.

</template>
