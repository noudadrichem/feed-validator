<template>
  <div id="app">
    <div v-show="!homepage" @click="back" class="backButton" data-tooltip="Go back one step" data-position="bottom left">
      <i class="arrow left icon"></i>
    </div>
    <router-view></router-view>
    <footer class="footer">
      <div>Build with 💙 by <router-link to="/"><img class="ui small image foot" src="~assets/logo.svg" alt="logo"></router-link></div>
    </footer>
  </div>
</template>

<script>
  import router from '@/router'

  export default {
    name: 'bannerwiseFeedValidator',
    computed: {
      homepage () {
        return this.$route.path === '/' ? true : false
      }
    },
    methods: {
      back() {
        router.back()
      }
    }
  }
</script>

<style lang="stylus" scoped>
.footer
  width:100%
  text-align:center !important
  box-shadow:none
  padding:10px
  div
    margin:auto
    display:flex
    align-items:center
    justify-content:center
    color:#93959b
    width:265px
    .ui.small.image.foot
      display:inline-block
      margin-left:5px

.backButton
  color:#2b90d9
  cursor:pointer
  size = 30px
  position:fixed
  top:10px
  left:10px
  z-index:100
  width:size
  height:size
  text-align:center
  line-height:size
  .icon
    color:inherit
    font-size:1.5em
    margin:0
    padding:0
</style>
