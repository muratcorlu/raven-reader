<template>
  <div class="preference-container">
    <div class="col p-4">
    <h5>Proxy Settings</h5>
    <b-form-group label="Web Server (HTTP):">
      <b-form-input v-model="proxy.http"
                    type="text"></b-form-input>
    </b-form-group>
    <b-form-group label="Secure Web Server (HTTPS):">
      <b-form-input v-model="proxy.https"
                    type="text"></b-form-input>
    </b-form-group>
    <b-form-group label="Bypass proxy settings for these hosts & domains:">
      <b-form-textarea v-model="proxy.bypass"
                       :rows="3"
                       :max-rows="6"></b-form-textarea>
    </b-form-group>
    <b-button @click="applyProxy">Apply & Restart</b-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      proxy: {
        http: '',
        https: '',
        bypass: ''
      }
    }
  },
  mounted () {
    this.$store.dispatch('loadSettings')
    if (this.$store.state.Setting.proxy) {
      this.proxy.http = this.$store.state.Setting.proxy.http
      this.proxy.https = this.$store.state.Setting.proxy.https
      this.proxy.bypass = this.$store.state.Setting.proxy.bypass
    }
  },
  methods: {
    applyProxy () {
      this.$store.dispatch('setProxy', this.proxy)
      this.$electron.remote.app.relaunch()
      this.$electron.remote.app.exit(0)
    }
  }
}
</script>
