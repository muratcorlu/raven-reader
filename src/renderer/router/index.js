import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main-page',
      component: require('@/views/Main').default
    },
    {
      path: '/article/:id',
      name: 'article-page',
      component: require('@/views/Main').default
    },
    {
      path: '/feed/:feedid',
      name: 'feed-page',
      component: require('@/views/Main').default
    },
    {
      path: '/user-preference',
      component: require('@/views/settings/UserPreference').default,
      children: [
        {
          path: '/general-settings',
          name: 'general-settings',
          component: require('@/views/settings/GeneralSettings').default
        },
        {
          path: '/appearance-settings',
          name: 'appearance-settings',
          component: require('@/views/settings/AppearanceSettings').default
        },
        {
          path: '/proxy-settings',
          name: 'proxy-settings',
          component: require('@/views/settings/ProxySettings').default
        },
        {
          path: '/integrations',
          name: 'integrations',
          component: require('@/views/settings/Integrations').default
        },
        {
          path: '/import-export',
          name: 'import-export',
          component: require('@/views/settings/ImportExport').default
        },
        {
          path: '',
          component: require('@/views/settings/GeneralSettings').default
        }
      ]
    },
    {
      path: '/:type',
      component: require('@/views/Main').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
