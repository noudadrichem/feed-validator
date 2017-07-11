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

        <div v-if="" class="ui row">
          <div class="ui sixteen wide column">
            <p v-show="fileName" class='ui message'>
              You uploaded: <b>{{ fileName }}</b> and have a total of
              <b>{{ errors.length }}</b> invalid item(s) in your feed.
            </p>

            <div v-if="tested">
              <h1>Breaking Errors</h1>
              <div v-for="(err, index) in errors" v-if="err.err" class="ui error message">
                <p ><span v-if="err.err"><b>{{ index + 1 }}</b>: {{ err.message }}</span></p>
              </div>

              <h1>Recommended to change</h1>
              <div v-for="(err, index) in recomments" v-if="err.err" class="ui warning message">
                <p ><span v-if="err.err"><b>{{ index + 1 }}</b>: {{ err.message }}</span></p>
              </div>
            </div>

            <div v-show="errors.length <= 0 && tested == true">
              <div class="ui success message">
                <img src="" alt="">
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
    name: 'csvUploadDoubleclick',
    data () {
      return {
        title: 'Upload your Doubleclick CSV feed',
        btnTxt: 'Upload',
        fileName: '',
        error: '',
        body: {
          feed: ''
        },
        response: [],
        loading: false,
        tested: false
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

        reader.readAsText(file)

        reader.onload = () => {
          const dataSample = pipe(
            replace(/\n/g, '~\n'),
            split('~'),
            take(10),
            join(''),
            window.btoa
          )(reader.result)
          console.log('results', dataSample)
          this.$set(this.body, 'feed', dataSample)
          this.uploadAdformCsv(this.body)
        }
      },

      uploadAdformCsv (body) {
        this.$http.post(`${Vue.$config.apiUrl}/v1/doubleclick/csv`, body)
          .then(({ body: res }) => {
            console.log(res)
            this.$set(this, 'loading', false)
            this.$set(this, 'tested', true)
            this.$set(this, 'response', res)
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
