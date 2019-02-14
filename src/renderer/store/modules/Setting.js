import Store from 'electron-store'

const state = {
  cronSettings: '*/5 * * * *',
  darkMode: false,
  offline: false,
  markallAsk: false,
  recentlyRead: 'on',
  proxy: {
    http: '',
    https: '',
    bypass: ''
  }
}

const store = new Store()

const mutations = {
  LOAD_SETTINGS (state) {
    state.cronSettings = store.get('settings.cronjob')
    state.darkMode = store.get('settings.darkMode')
    state.proxy = store.get('settings.proxy')
    state.recentlyRead = store.get('settings.recentlyRead')
    state.markallAsk = store.get('settings.markallAsk')
  },
  CHECK_OFFLINE (state) {
    state.offline = !navigator.onLine
  },
  SET_CRONJOB (state, data) {
    state.cronSettings = data
  },
  SET_DARKMODE (state, data) {
    state.darkMode = data
  },
  SET_OFFLINE (state, data) {
    state.offline = data === 'offline'
  },
  SET_PROXY (state, data) {
    state.proxy = data
  },
  SET_MARKALL_ASK (state, data) {
    state.markallAsk = data
  },
  SET_RECENTLY_READ (state, data) {
    state.recentlyRead = data
  }
}

const actions = {
  loadSettings ({ commit }) {
    commit('LOAD_SETTINGS')
  },
  setCronJob ({ commit }, data) {
    store.set('settings.cronjob', data)
    commit('SET_CRONJOB', data)
  },
  setOffline ({ commit }, data) {
    commit('SET_OFFLINE', data)
  },
  setDarkMode ({ commit }, data) {
    store.set('settings.darkMode', data)
    commit('SET_DARKMODE', data)
  },
  checkOffline ({ commit }) {
    commit('CHECK_OFFLINE')
  },
  setProxy ({ commit }, data) {
    store.set('settings.proxy', data)
    commit('SET_PROXY')
  },
  setMarkAllAsk ({ commit }, data) {
    store.set('settings.markallAsk', data)
    commit('SET_MARKALL_ASK')
  },
  setRecentlyRead ({ commit }, data) {
    store.set('settings.recentlyRead', data)
    commit('SET_RECENTLY_READ')
  }
}

export default {
  state,
  mutations,
  actions
}
