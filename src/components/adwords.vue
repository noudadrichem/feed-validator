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

              <!-- <label for="seperator">What kind of seperator are you using?</label><br>
              <select @change="disable" v-model="body.separator" class='ui selection dropdown' id="seperator">
                <option value=''>Choose seperator</option>
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value=";">Vertical bar (|)</option>
                <option value=";">Tab (\t)</option>
              </select>
 -->


              <input @change="getFile" ref="input" type="file" name="input" id="input"/>
              <label ref="label" class="ui fluid primary button" for="input">{{ btnTxt }}</label>
            </div>


          </div>
        </div>

        <div class="ui row">
          <div class="ui sixteen wide column">

            <div v-if="error" class="ui error message">
              The tests have failed, here is the reason why: <b>{{ error }}</b>
            </div>

            <p v-show="fileName" class='ui message'>
              You uploaded: <b>{{ fileName }}</b> and have a total of
              <b>{{ errors.length }}</b> invalid item(s) in your feed.
            </p>

            <div v-for="(err, index) in errors" v-if="err.err" class="ui error message">
              <p ><span v-if="err.err"><b>{{ index + 1 }}</b>: {{ err.message }}</span></p>
            </div>

            <div v-show="errors.length <= 0 && tested == true">
              <div class="ui success message">
                Your feed has been successfully validated and we found <b>{{ errors.length}}</b> errors &#9752;
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
    name: 'csvUploadAdwords',
    data () {
      return {
        title: 'Upload your Adwords CSV feed',
        btnTxt: 'Upload',
        fileName: '',
        error: '',
        body: {
          file: '',
        },
        response: [],
        loading: false,
        tested: false,
        feedType: 'custom'
      }
    },

    computed: {
      errors () {
        return pipe(
          flatten,
          filter(propEq('err', true))
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
      getFile () {
        this.$set(this, 'loading', true)
        const input = this.$refs.input
        const file = input.files[0]
        const reader = new FileReader()
        this.$set(this, 'fileName', file.name)

        reader.readAsDataURL(file)

        reader.onload = () => {
          this.$set(this.body, 'file', reader.result)
          this.adwordsPreFlight(this.body)
        }
      },

      adwordsPreFlight (body) {
        this.$http.post(`${url}/v1/adwords/preFlight`, body)
          .then(({ body: res }) => {
            this.$set(this, 'loading', false)
            this.$set(this, 'response', res.results)

            this.errors.length === 0
            ? this.adwordsPostFlight(prop('fileId', res))
            : this.$set(this, 'response', res.results) && this.$set(this, 'loading', false)
          })
      },

      adwordsPostFlight (fid) {
        this.$http.get(`${url}/v1/adwords/postFlight/${this.feedType}/${fid}`)
          .then(({ body: res }) => {
            res.message
            ? this.$set(this, 'error', res.message)
            : this.$set(this, 'response', res) && this.$set(this, 'tested', true)
            this.$set(this, 'loading', false)
          })
      },

      disable () {
        const label = this.$refs.label

        if (this.body.seperator === '') {
          label.classList.add('disabled')
          this.btnTxt = 'Please provide a seperator'
        } else {
          label.classList.remove('disabled')
          this.btnTxt = 'Upload'
        }
      }
    },
    updated () {
      console.log('recomments', this.recomments)
    }
  }
</script>