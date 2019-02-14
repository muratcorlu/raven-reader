<template>
  <div class="app-wrapper" :class="{ 'app-darkmode': $store.state.Setting.darkMode === 'on' }">
    <nav class="bg-light sidebar">
      <div class="sidebar-sticky">
        <ul class="nav flex-column">
          <li class="nav-item">
            <router-link class="nav-link" to="general-settings" active-class="active">
              <feather-icon name="settings"></feather-icon>
              General Settings <span class="sr-only">(current)</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="appearance-settings" active-class="active">
              <feather-icon name="box"></feather-icon>
              Appearance settings
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="proxy-settings" active-class="active">
              <feather-icon name="server"></feather-icon>
              Proxy Settings
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="integrations" active-class="active">
              <feather-icon name="package"></feather-icon>
              Integrations
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="import-export" active-class="active">
              <feather-icon name="share"></feather-icon>
              Import & Export
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  mounted () {
    this.$store.dispatch('loadSettings')
  }
}
</script>
<style lang="scss">
.app-darkmode {
  .preference-container {
    background: #373737 !important;
    color: #fff;
  }
}
.preference-container {
  position: relative;
  flex-grow: 1;
  height: 100%;
}
</style>
