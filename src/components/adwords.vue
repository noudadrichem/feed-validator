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

              <label for="seperator">What kind of feedtype are you using?</label><br>
              <select @change="" v-model="feedType" class='ui selection dropdown' id="seperator">
                <option value="">Choose your feedtype</option>
                <option v-for="feedtype in feedTypes" :value="feedtype">{{feedtype}}</option>
              </select>



              <input @change="getFile" ref="input" type="file" name="input" id="input"/>
              <label ref="label" class="ui fluid primary button" for="input">{{ btnTxt }}</label>
            </div>

          </div>
        </div>

        <div class="ui row">
          <div class="ui sixteen wide column">

            <div v-show="error" class="ui error message">
              The tests have failed, here is the reason why: <b>{{ error }}</b>
            </div>

            <div v-show="fileName" class='ui message default'>
              You uploaded: <b>{{ fileName }}</b> and have a total of
              <b>{{ errors.length }}</b> invalid item(s) in your feed.
            </div>

            <div v-for="(err, index) in errors" v-if="err.err" class="ui error message">
              <p><span v-show="err.err"><b>{{ index + 1 }}</b>: {{ err.message }}</span></p>

              <div v-if="err.additionalReturns.valueNames">
                <a @click="showValueNames = !showValueNames">Show available headers</a>
                <div v-show="showValueNames">
                  <div class="item" v-for="valueName in err.additionalReturns.valueNames">• {{ valueName }} </div>
                  <a @click="showValueNames = !showValueNames">Hide available headers</a>
                </div>
              </div>

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
  import Vue from 'vue'
  import { pipe, flatten, filter, prop, propEq, split, take, replace, join } from 'ramda'

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
        feedType: '',
        feedTypes: ['custom', 'education', 'travel', 'realEstate', 'localDeals', 'jobs', 'HAR', 'flights'],
        additionalHeaders: [],
        showValueNames: false
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
      },

      additionalReturns () {
        return this.errors.map(error => {
          if (error.additionalReturns.valueNames) {
            return this.$set(this, 'additionalHeaders', error.additionalReturns.valueNames)
          } else {
            return 'No value names returned'
          }
        })
      }
    },

    methods: {
      getFile () {
        this.$set(this, 'loading', true)
        const input = this.$refs.input
        const file = input.files[0]
        const reader = new FileReader()
        this.$set(this, 'fileName', file.name)

        reader.readAsText(file)

        reader.onload = () => {
          const dataSample = pipe(
            replace(/\n/g, '~\n'),
            split('~'),
            take(10),
            join(''),
            window.btoa
          )(reader.result)
          this.$set(this.body, 'file', dataSample)
          this.adwordsPreFlight(this.body)
        }
      },

      adwordsPreFlight (body) {
        this.$http.post(`${Vue.$config.apiUrl}/v1/adwords/preFlight`, body)
          .then(({ body: res }) => {
            this.$set(this, 'loading', false)
            this.$set(this, 'response', res.results)

            this.errors.length === 0
            ? this.adwordsPostFlight(prop('fileId', res))
            : this.$set(this, 'response', res.results) && this.$set(this, 'loading', false)
          })
      },

      adwordsPostFlight (fileId) {
        this.$http.get(`${Vue.$config.apiUrl}/v1/adwords/postFlight/${this.feedType}/${fileId}`)
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
    }
  }
</script>
