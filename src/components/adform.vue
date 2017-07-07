<template>
  <div id="adform">
    <div class="ui segment">
      <div class="ui container">
        <div class="ui blue centered header">
          <h1>{{ title }}</h1>
        </div>

        <div class="ui two column grid">
          <div @click="getFileType('csv')" class="column">
            <div class="column-content">
              <div class="ui centered header">
                <h1>CSV</h1>
              </div>
            </div>
          </div>

          <div @click="getFileType('xml')" class="column">
            <div class="column-content">
              <div class="ui centered header">
                <h1>XML</h1>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import router from '@/router'
  export default {
    name: 'chooseAdformFileType',
    data () {
      return {
        title: 'Choose the kind of file you like to validate'
      }
    },
    methods: {
      getFileType (type) {
        router.push(`adform/${type}`)
      }
    }
  }
</script>
