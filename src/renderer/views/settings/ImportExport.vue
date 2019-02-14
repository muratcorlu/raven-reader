<template>
  <div class="preference-container">
    <div class="col p-4">
      <b-form-group label="Import Subscriptions from OPML file" label-class="font-weight-bold mb-3">
        <b-form-file v-model="file" placeholder="Choose a file..." accept=".xml, .opml"></b-form-file>
        <b-form-text id="inputLiveHelp">
          OPML is a standard format to import or export feed subscriptions. You can export OPML files from other readers and import it.
        </b-form-text>
      </b-form-group>
      <button type="button" class="btn btn-primary" @click="importFeed" :disabled="disableImport">Import</button>
      <b-form-group class="mt-5" label="Export all subscriptions" label-class="font-weight-bold">
        <button class="btn btn-primary mt-3" @click="exportOpml">Download</button>
      </b-form-group>
    </div>
  </div>
</template>
<script>
import fs from 'fs'
import opmlParser from 'node-opml-parser'
import helper from '../../services/helpers'
import notifier from 'node-notifier'
import path from 'path'

export default {
  data () {
    return {
      file: null
    }
  },
  mounted () {
    this.$store.dispatch('refreshFeeds')
    this.$store.dispatch('loadFeeds')
  },
  computed: {
    disableImport () {
      return this.$store.state.Setting.offline
    }
  },
  methods: {
    hideModal () {
      this.$refs.importFeed.hide()
    },
    onHidden () {
      this.file = null
    },
    exportOpml () {
      const xmlData = helper.exportOpml()
      const self = this
      fs.unlink(`${self.$electron.remote.app.getPath('downloads')}/subscriptions.xml`, (err) => {
        if (err && err.code !== 'ENOENT') throw err
        fs.writeFile(`${self.$electron.remote.app.getPath('downloads')}/subscriptions.xml`, xmlData, { flag: 'w', encoding: 'utf8' }, (err) => {
          if (err) throw err
          console.log('XML Saved')
        })
      })
      notifier.notify({
        icon: path.join(__static, '/logo_icon.png'),
        title: 'Feeds exported',
        message: `All feeds are exported as opml in downloads folder.`,
        sound: true
      })
    },
    importFeed () {
      fs.readFile(this.file.path, 'utf8', (err, data) => {
        if (err) {
          this.$toast('Oops! something went wrong', {
            className: 'et-alert',
            horizontalPosition: 'center'
          })
        }

        opmlParser(data, (err, data) => {
          if (err) {
            this.$toast('Oops! something went wrong', {
              className: 'et-alert',
              horizontalPosition: 'center'
            })
          }
          helper.subscribe(data, null, false, true)
        })
      })

      this.file = null
      this.hideModal()
    }
  }
}
</script>
