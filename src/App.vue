<template>
  <div id="app">
    <app-header>
      <template #logo>
        <router-link :to="{ name: 'Home' }" class="navbar-brand">
          User Management System
        </router-link>
      </template>
      <template #menu>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown text="Menu" right v-if="IsSignedIn">
            <b-dropdown-item
              :key="`rl${index}`"
              :to="item.to"
              v-for="(item, index) in routeLinks"
            >
              {{ item.name }}
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item
          v-if="IsSignedIn && User"
          >
            {{ User }}
          </b-nav-item>
          <b-nav-item
            @click="SignOut"
            v-b-modal.logoutModal
            v-if="IsSignedIn"> Sign Out
          </b-nav-item>
        </b-navbar-nav>
      </template>
    </app-header>
    <router-view class="router-content" />
    <app-footer :currentYear="currentYear" :version="version" />
    <b-modal id="logoutModal" title="Sign Out">
      <p>Are you sure you want to Sign Out?</p>
    </b-modal>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import AppFooter from '@/components/shared/AppFooter.vue';
import AppHeader from '@/components/shared/AppHeader.vue';

export default {
  computed: {
    ...mapGetters({
      IsSignedIn: 'userStore/IsSignedIn',
      Loading: 'userStore/Loading',
      User: 'userStore/User',
    }),
    appName() {
      return 'Bank System';
    },
    routeLinks() {
      const routeItem = this.$router.options.routes
        .filter((r) => r.name === 'Users')
        .map((s) => ({
          to: s.path,
          name: s.name,
        }));
      return routeItem;
    },
  },
  components: {
    AppFooter,
    AppHeader,
  },
  data() {
    return {
      currentYear: new Date().getFullYear(),
      version: process.env.VUE_APP_VERSION,
    };
  },
  methods: {
    ...mapActions({
      SignOut: 'userStore/SignOut',
    }),
  },
  name: 'app',
};
</script>
<style>
</style>
