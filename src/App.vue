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
  padding: 0;
  margin: 0;
  height: 100%;
  position: relative;
  overflow-x: hidden;
}

img {
  max-width: 100%;
}

ul {
  padding: 0;
  margin: 0;
  list-style-type: none;

  & li {
    font-size: $font-size-base;
  }
}

a,
li {
  text-decoration: none;
}
</style>
