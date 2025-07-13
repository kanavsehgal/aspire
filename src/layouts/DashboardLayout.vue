<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Sidebar Drawer -->
    <q-drawer
      v-model="drawer"
      show-if-above
      persistent
      :width="340"
      :breakpoint="900"
      class="bg-navy-dark sidebar-drawer"
      bordered
    >
      <div class="sidebar-header q-pa-xl text-left">
        <img src="../assets/logo.svg" alt="Aspire Logo" class="logo logo-mb" />
        <div
          class="tagline text-white text-opacity-30 text-body2"
          v-html="t('dashboard.sidebar.tagline')"
        ></div>
      </div>
      <q-list class="nav-list q-px-sm">
        <q-item
          v-for="item in navigationItems"
          :key="item.name"
          v-ripple
          clickable
          class="nav-item q-py-md q-px-xl"
          :class="{ active: route.name === item.name }"
          :to="item.route"
        >
          <q-item-section avatar>
            <img :src="getIconLink(item.icon)" :alt="item.name" class="nav-icon" />
          </q-item-section>
          <q-item-section class="nav-text" :class="{ 'active-text': route.name === item.name }">
            {{ t(item.labelKey) }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <!-- Main Content -->
    <q-page-container class="main-content">
      <slot />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useIconPath } from '../composables/useIconPath'

const route = useRoute()
const { t } = useI18n()
const drawer = ref(true)

// Use the icon path composable
const { getIconLink } = useIconPath()

const navigationItems = ref([
  {
    name: 'Home',
    labelKey: 'dashboard.sidebar.nav.home',
    icon: '../assets/home.svg',
    route: '/',
  },
  {
    name: 'Cards',
    labelKey: 'dashboard.sidebar.nav.cards',
    icon: '../assets/card.svg',
    route: '/cards',
  },
  {
    name: 'Payments',
    labelKey: 'dashboard.sidebar.nav.payments',
    icon: '../assets/image1.svg',
    route: '/payments',
  },
  {
    name: 'Credit',
    labelKey: 'dashboard.sidebar.nav.credit',
    icon: '../assets/credit.svg',
    route: '/credit',
  },
  {
    name: 'Settings',
    labelKey: 'dashboard.sidebar.nav.settings',
    icon: '../assets/user.svg',
    route: '/settings',
  },
])
</script>

<script lang="ts">
// This empty script ensures a default export for script setup
export default {}
</script>

<style lang="scss" scoped>
@import '../styles/colors';
@import '../styles/variables';

.sidebar-drawer {
  width: 340px !important;
  min-width: 340px;
  max-width: 340px;
  background: $color-navy-dark;
  box-shadow: 2px 0 8px 0 rgba(0, 0, 0, 0.04);
  border-right: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.sidebar-header {
  .logo {
    width: 120px;
  }
  .logo-mb {
    margin-bottom: 20px;
  }
  .tagline {
    font-family: 'Open Sans', sans-serif;
    font-weight: 400;
    line-height: 1.4;
    opacity: 30%;
  }
}

.nav-list {
  width: 100%;
  padding-top: 33px;
  padding-bottom: 81px;
}

.nav-item {
  border-radius: $border-radius;
  margin-bottom: 62px;
  transition: background 0.2s;
  padding: 0 48px;

  &.active,
  &:hover {
    background: $color-navy-light;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.nav-icon {
  width: 24px;
  height: 24px;
}

.nav-text {
  font-family: 'Open Sans', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;

  &.active-text {
    font-weight: 700;
    color: #01d167;
  }
}

.q-item__section--main {
  flex: unset;
}

.main-content {
  min-height: 100vh;
  height: 100vh;
  width: calc(100vw - 340px);
  padding: 0;
  box-sizing: border-box;
}
</style>
