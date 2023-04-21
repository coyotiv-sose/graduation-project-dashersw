<script>
import axios from 'axios'
import CounterOptionsApi from '../components/CounterOptionsApi.vue'
import PicnicItem from '../components/PicnicItem.vue'
import User from '../components/User.vue'
import { mapState } from 'pinia'
import { useAccountStore } from '../stores/account'

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
  },
  computed: {
    ...mapState(useAccountStore, ['user'])
  }
}
</script>

<template lang="pug">
div(v-if="!picnic")
  p Loading...
div(v-else)
  h2 {{picnic.name}}
  p(v-if="user && user._id == picnic?.attendees?.[0]?._id")
    RouterLink(to="/picnics/:id/edit") Edit picnic

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
