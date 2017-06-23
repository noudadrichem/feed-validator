import Vue from 'vue'
import Router from 'vue-router'
import chooseNetwork from '@/components/chooseNetwork'

import adform from '@/components/adform'
import adformXmlUpload from '@/components/adform/XmlUpload'
import adformCsvUpload from '@/components/adform/CsvUpload'

import adwords from '@/components/adwords'

import googleMerchantCenter from '@/components/googleMerchantCenter'

import doubleclick from '@/components/doubleclick'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      name: 'chooseNetwork',
      component: chooseNetwork
    },
    {
      path: '/adform',
      name: 'chooseAdformFileType',
      component: adform
    },
    {
      path: '/adform/csv',
      name: 'adformFileCsvUpload',
      component: adformCsvUpload
    },
    {
      path: '/adform/xml',
      name: 'adformFileXmlUpload',
      component: adformXmlUpload
    },
    {
      path: '/adwords',
      name: 'adwordsFileXmlUpload',
      component: adwords
    },
    {
      path: '/googlemerchantcenter',
      name: 'googleMerchantCenterXmlUpload',
      component: googleMerchantCenter
    },
    {
      path: '/doubleclick',
      name: 'chooseDoubleclickFileType',
      component: doubleclick
    }
  ]
})
