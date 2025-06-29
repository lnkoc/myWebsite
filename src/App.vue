<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
body {
  background-color: $primary-background-color;
  font-family: 'Roboto', sans-serif;
  font-size: $font-size-base;
  color: $primary-color;
  height: 100%;
  position: relative;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
