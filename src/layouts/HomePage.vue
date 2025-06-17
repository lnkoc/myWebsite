<script setup>
import { ref } from 'vue'

const refreshKey = ref(0)

function refresh() {
  refreshKey.value++
}
</script>
<template>
  <header>
    <nav>
      <ul>
        <li>
          <RouterLink to="/blog" @click="refresh">Blog</RouterLink>
        </li>
        <li>
          <RouterLink to="/webgl">WebGL</RouterLink>
        </li>
        <li>
          <RouterLink to="/hobby">Hobby</RouterLink>
        </li>
        <li>
          <RouterLink to="/about">O mnie</RouterLink>
        </li>
        <li>
          <RouterLink to="/contact">Kontakt</RouterLink>
        </li>
        <li>
          <RouterLink to="/login">ZALOGUJ</RouterLink>
        </li>
      </ul>
    </nav>
  </header>
  <RouterView :key="refreshKey" />
</template>

<style scoped>
ul li {
  display: inline;
  margin-inline: 5px;
}
</style>
