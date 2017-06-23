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

          <div class="ui segment merchantCenter">

            <!-- <label for="feedType">Enter your feed type</label><br> -->
            <select @change="" v-model="body.feedType" class='ui selection dropdown'>
              <option value=''>Choose feedType</option>
              <option value="ANA">Clothing and accessories</option>
              <option value="media">Media</option>
              <option value="software">Software</option>
              <option value="variant">Variant</option>
              <option value="other">Other</option>
            </select>

            <!-- <label for="feedType">Enter your country</label><br> -->
            <select @change="" v-model="body.country" class='ui selection dropdown'>
              <option value="">Choose country</option>
              <option v-for="country in countries" :value='country'>{{ country }}</option>
            </select>

            <select v-if="body.feedType === 'ANA'" class="ui selection dropdown">
              <option value="">Choose catagory</option>
              <option v-for="catagory in subCatagories" :value="catagory">{{ catagory }}</option>
            </select>

            <div class="ui fluid input">
              <input ref="urlInput" v-model="body.url" type="text" placeholder="Enter XML feed URL...">
            </div>

            <label @click="uploadGMCXML" ref="label" class="ui fluid primary button" for="input">{{ btnTxt }}</label>
<br>
            <div v-if="error" class="ui warning message">
              {{ error }}. <b>Did you fil in all the selections?</b>
            </div>
            <div v-if="urlError" class="ui warning message">
              {{ urlError }}
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

          <div v-if="err.err" v-for="(err, index) in errors" class="ui error message">
            <p><span v-if="err.err"><b>{{ index + 1 }}</b>: {{ err.message }}</span></p>
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
  import { pipe, flatten, filter, prop, propEq } from 'ramda'
  let local = true
  const url = local ? 'http://localhost:9097' : 'http://fabulousduck.com:9097'

  export default {
    name: 'XmlUploadGoogleMerchantCenter',
    data() {
      return {
        title: 'Enter your Google merchant center XML feed URL here',
        btnTxt: 'Upload',
        fileName: '',
        error: '',
        subCatagories: ['clothing', 'shoes'],
        body: {
          url: '',
          feedType: '',
          subCatagory: 'Clothing',
          country: ''
        },
        response: [],
        loading: false,
        tested: false,
        urlError: '',
        countries: [
          'Argentina',
          'Australia',
          'Austria',
          'Belgium',
          'Brazil',
          'Chili',
          'Colombia',
          'Czech Republic',
          'Denmark',
          'France',
          'Germany',
          'Hong-Kong',
          'India',
          'Indonesia',
          'Ireland',
          'Italy',
          'Japan',
          'Malaysia',
          'Mexico',
          'Netherlands',
          'New Zealand',
          'Norway',
          'Philippines',
          'Poland',
          'Portugal',
          'Russia',
          'Singapore',
          'South Africa',
          'Spain',
          'Sweden',
          'Switzerland',
          'Taiwan',
          'Turkey',
          'United Arab Emirates',
          'United States'
        ]
      }
    },

    computed: {
      errors() {
        return pipe(
          flatten,
          filter(propEq('err', true))
        )(this.response)
      }
    },

    methods: {
      uploadGMCXML() {
        const urlReg = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)\.xml/)
        const givenUrl = this.$refs.urlInput.value

        if(givenUrl.match(urlReg)) {
          this.$set(this, 'loading', true)

          this.$http.post(`${url}/v1/merchantcenter`, this.body)
            .then(({ body: res }) => {
              this.$set(this, 'loading', false)
              this.$set(this, 'urlError', '')

              res.message
              ? this.$set(this, 'error', res.message)
              : this.$set(this, 'response', res) && this.$set(this, 'tested', true)
            })
        } else {
          this.$set(this, 'urlError', 'Make sure you\'re uploading an .xml file (url ending with .xml)')
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
.merchantCenter
  padding:0 !important
  .ui.selection.dropdown
    width:100% !important
    display:block
    margin:20px 0
  .ui.primary.button
    margin-top:20px !important
</style>
