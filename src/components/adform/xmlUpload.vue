<template>
  <div id='upload'>
    <div class="ui container">
      <div class="ui centered blue header">
        <h1>{{ title }}</h1>
      </div>

      <div class="ui grid">

        <div class="ui row">
          <div class="center aligned three wide column"></div>
          <div class="center aligned six wide column">
            <div class="ui segment">
              <div class="ui fluid input">
                <input ref="urlInput" v-model="body.url" type="text" placeholder="Enter XML feed URL...">
              </div>
              <br>

              <label @click="uploadAdformXML" ref="label" class="ui fluid primary button" for="input">{{ btnTxt }}</label>
<br>
              <div v-if="error" class="ui warning message">
                {{ error }}.
              </div>

              <div v-if="urlError" class="ui warning message">
                {{ urlError }}.
              </div>
            </div>
          </div>
        </div>

        <div v-if="" class="ui row">

          <div class="ui sixteen wide column">

            <p v-show="fileName" class='ui message'>
              You uploaded: <b>{{ fileName }}</b> and have a total of
              <b>{{ errors.length }}</b> invalid item(s) in your feed.
            </p>

            <div v-if="tested">

              <h1>Breaking errors</h1>
              <div v-if="err.err" v-for="(err, index) in errors" class="ui error message">
                <p ><span v-if="err.err"><b>{{ index + 1 }}</b>: {{ err.message }}</span></p>
              </div>

              <h1>Recommended to change</h1>
              <div v-if="err.err" v-for="(err, index) in recomments" class="ui warning message">
                <p ><span v-if="err.err"><b>{{ index + 1 }}</b>: {{ err.message }}</span></p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" id="loading">
      <div class="spinner">LOADING...</div>
    </div>
  </div>
</template>

<script>
  /*eslint-disable*/
  import { pipe, flatten, filter, prop, propEq } from 'ramda'
  let local = true
  const url = local ? 'http://localhost:9097' : 'http://fabulousduck.com:9097'

  export default {
    name: 'xmlUploadAdform',
    data () {
      return {
        title: 'Enter your Adform XML feed URL',
        btnTxt: 'Upload',
        fileName: '',
        urlError: '',
        error: '',
        body: {
          url: ''
        },
        response: [],
        tested: false,
        loading: false
      }
    },

    computed: {
      errors () {
        return pipe(
          flatten,
          filter(propEq('err', true)),
          filter(propEq('type', 'BREAKING_ERR'))
        )(this.response)
      },

      recomments () {
        return pipe(
          flatten,
          filter(propEq('type', 'RECCOMMEND_ERR'))
        )(this.response)
      }

    },

    methods: {
      uploadAdformXML () {
        const urlReg = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)\.xml/)
        const givenUrl = this.$refs.urlInput.value

        if (givenUrl.match(urlReg)) {
          this.$set(this, 'loading', true)
          this.$http.post(`${url}/v1/adform/xml`, this.body)
            .then(({ body: res }) => {
              this.$set(this, 'urlError', '')
              this.$set(this, 'loading', false)

              res.message
              ? this.$set(this, 'error', res.message)
              : this.$set(this, 'response', res) && this.$set(this, 'tested', true)
            })
        } else {
          this.$set(this, 'tested', false)
          this.$set(this, 'urlError', 'Make sure you\'re uploading an .xml file (url ending with .xml)')
        }
      }
    },
    updated () {
      // console.log('breaking errors', this.errors)
      // console.log('recommended errors', this.recomments)
    }
  }
</script>
