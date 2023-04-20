<script>
import axios from 'axios'
import CounterOptionsApi from '../components/CounterOptionsApi.vue'
import PicnicItem from '../components/PicnicItem.vue'
import User from '../components/User.vue'

export default {
  name: 'PicnicDetail',
  components: {
    CounterOptionsApi,
    PicnicItem,
    User
  },
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
CounterOptionsApi(name="counter1Name")
CounterOptionsApi(name="counter2Name")
div(v-if="!picnic")
  p Loading...
div(v-else)
  h2 Picnic {{picnic.name}}

  h3 at {{picnic.location}} on {{picnic.date}}

  p {{picnic.attendees.length}} people are attending:

  ul
    li(v-for="attendee in picnic.attendees" :key="attendee._id")
      User(:user="attendee")

  div(v-if="picnic.items.length === 0")
    p No items have been added to this picnic yet.
  div(v-else)
    p They will bring the following items:
    ul
      li(v-for="item in picnic.items" :key="item._id")
        PicnicItem(:item="item")

</template>
