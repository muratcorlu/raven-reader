<template>
  <div class="preference-container">
    <div class="col p-4">
      <b-form-group label="Set refresh interval for news feed" label-class="font-weight-bold">
        <!-- <b-form-select v-model="cronjob" :options="cron_options" size="sm" @change="saveCronjob"/> -->
        <b-form-radio-group id="radios1" v-model="cronjob" :options="cron_options" name="cronOptions" stacked @change="saveCronjob">
        </b-form-radio-group>
      </b-form-group>
      <b-form-group label="Turn on dark mode" label-class="font-weight-bold">
        <b-form-radio-group id="darkMode"
        buttons
        button-variant="outline-primary"
        size="sm"
        v-model="darkMode"
        :options="options"
        name="darkTheme" @change="saveAppearance"/>
      </b-form-group>
      <b-form-group label="Ask before marking all as read" label-class="font-weight-bold">
        <b-form-radio-group id="markAllRead"
        buttons
        button-variant="outline-primary"
        size="sm"
        v-model="markallAsk"
        :options="options"
        name="markalLAsk" @change="saveMarkAllConfig"/>
      </b-form-group>
      <b-form-group label="Recently read section" label-class="font-weight-bold">
        <b-form-radio-group id="recentlyRead"
        buttons
        button-variant="outline-primary"
        size="sm"
        v-model="recentlyRead"
        :options="options"
        name="recentlyRead" @change="saveRecentlyRead"/>
      </b-form-group>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      cronjob: null,
      darkMode: 'off',
      markallAsk: 'on',
      recentlyRead: 'on',
      cron_options: [
        { value: '* * * * *', text: 'Every minute' },
        { value: '*/5 * * * *', text: 'Every 5 minutes' },
        { value: '*/10 * * * *', text: 'Every 10 minutes' },
        { value: '*/15 * * * *', text: 'Every 15 minutes' },
        { value: '*/20 * * * *', text: 'Every 20 minutes' },
        { value: '*/25 * * * *', text: 'Every 25 minutes' },
        { value: '*/30 * * * *', text: 'Every 30 minutes' },
        { value: '*/35 * * * *', text: 'Every 35 minutes' },
        { value: '*/40 * * * *', text: 'Every 40 minutes' },
        { value: '*/45 * * * *', text: 'Every 45 minutes' },
        { value: '*/50 * * * *', text: 'Every 50 minutes' },
        { value: '*/55 * * * *', text: 'Every 55 minutes' },
        { value: '*/60 * * * *', text: 'Every 60 minutes' }
      ],
      options: [
        { text: 'On', value: 'on' },
        { text: 'Off', value: 'off' }
      ]
    }
  },
  mounted () {
    this.$store.dispatch('loadSettings')
    this.cronjob = this.$store.state.Setting.cronSettings
    this.darkMode = this.$store.state.Setting.darkMode
  },
  methods: {
    saveCronjob (cronValue) {
      this.$store.dispatch('setCronJob', cronValue)
      this.$electron.ipcRenderer.send('settingsChanged')
    },
    markallAsk (mode) {
      this.$store.dispatch('setMarkAllAsk', mode)
      this.$electron.ipcRenderer.send('settingsChanged')
    },
    saveAppearance (darkMode) {
      this.$store.dispatch('setDarkMode', darkMode)
      this.$electron.ipcRenderer.send('settingsChanged')
    },
    saveRecentlyRead (mode) {
      this.$store.dispatch('setRecentlyRead', mode)
      this.$electron.ipcRenderer.send('settingsChanged')
    }
  }
}
</script>
