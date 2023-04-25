<script>
import axios from 'axios'
import CounterOptionsApi from '../components/CounterOptionsApi.vue'
import PicnicItem from '../components/PicnicItem.vue'
import User from '../components/User.vue'
import { mapState, mapActions } from 'pinia'
import { useAccountStore } from '../stores/account'
import { useSocketStore, socket } from '../stores/socket'
import { usePicnicStore } from '../stores/picnic'
import { onUnmounted } from 'vue'

export default {
  name: 'PicnicDetail',
  components: {
    CounterOptionsApi,
    PicnicItem,
    User
  },
  async created() {
    await this.fetchPicnic(this.$route.params.id)

    this.joinPicnic(this.picnic._id)
  },
  unmounted() {
    this.leavePicnic(this.picnic._id)
  },
  computed: {
    ...mapState(useAccountStore, ['user']),
    ...mapState(usePicnicStore, ['picnic'])
  },
  methods: {
    ...mapActions(usePicnicStore, ['fetchPicnic', 'bringItem', 'joinPicnic', 'leavePicnic'])
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

  p This picnic is hosted by: {{ picnic.attendees?.[0].name }}

  p {{ picnic.description }}

  p {{picnic.attendees?.length}} people are attending:

  ul
    li(v-for="attendee in picnic.attendees" :key="attendee._id")
      User(:user="attendee")

  div(v-if="picnic.items?.length === 0")
    p No items have been added to this picnic yet.
  div(v-else)
    p They will bring the following items:
    ul
      li(v-for="item in picnic.items" :key="item._id")
        PicnicItem(:item="item")
        button(@click="bringItem(picnic._id, item.name, user._id)" v-if="user") Bring

</template>
