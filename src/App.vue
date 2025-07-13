<template>
  <DashboardLayout>
    <router-view />
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
</script>

<style lang="scss">
@import './styles/colors';
@import './styles/variables';
@import './styles/mixins';

#app {
  width: 100%;
  max-width: unset;
  padding: unset;
}

body {
  background: $color-background-secondary;
}
</style>
