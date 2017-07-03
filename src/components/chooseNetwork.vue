<template>
  <div id="chooseNetwork">
    <div class="ui segment">
      <div class="ui container">
        <div class="ui blue centered header">
          <h1>{{ title }}</h1>
        </div>

        <div class="ui two column centered grid">
          <div class="column network">
            <div @click="routeTo('adform')" class="column-content">
              <img class="ui image" src="https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Adform_logo.svg/1280px-Adform_logo.svg.png" alt="adform logo">
            </div>
          </div>

          <div class="column network">
            <div @click="routeTo('adwords')" class="column-content">
              <img class="ui image" src="http://turquoisetech.com/wp-content/themes/energy/images/googleAdWordsLogo.png" alt="adwords logo">
            </div>
          </div>
        </div>

        <div class="ui two column centered grid">
          <div class="column network">
            <div @click="routeTo('googlemerchantcenter')" class="column-content">
              <img class="ui image" src="http://www.adverticapro.com/wp-content/uploads/2015/05/google-merchant-center.png" alt="google merchant center">
            </div>
          </div>

          <div class="column network">
            <div @click="routeTo('doubleclick')" class="column-content">
              <img class="ui image" src="https://cdn.worldvectorlogo.com/logos/doubleclick.svg" alt="Doubleclick">
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import { eventBus } from '../eventBus'
  import router from '@/router'

  export default {
    name: 'chooseNetwork',
    data () {
      return {
        title: 'Choose your advertisement network'
      }
    },
    methods: {
      routeTo (component) { router.push(component) }
    }
  }
</script>
