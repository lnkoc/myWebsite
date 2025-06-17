<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useSessionStore } from '@/stores/session'

const router = useRouter()
const session = useSessionStore()

function logout() {
  session.clear()
  router.push('/')
}
</script>

<template>
  <h1>Dashboard</h1>
  <header>
    <nav>
      <ul>
        <li><RouterLink to="/dashboard/summary">Podsumowanie</RouterLink></li>
        <li><RouterLink to="/dashboard/create">Dodaj wpis</RouterLink></li>
        <li><RouterLink to="/dashboard/list">Lista wpisów</RouterLink></li>
        <li><RouterLink to="/dashboard/drafts">Lista szkiców</RouterLink></li>
        <li><RouterLink to="/dashboard/pictures">Obrazy</RouterLink></li>
        <li><RouterLink to="/dashboard/trash">Kosz</RouterLink></li>
        <li><a href="" @click="logout">Wyloguj</a></li>
      </ul>
    </nav>
  </header>

  <RouterView />

  <footer>{{ session.note }} Licznik akcji: {{ session.useCounter }}</footer>
</template>

<style scoped>
ul li {
  display: inline;
  margin-inline: 5px;
}
</style>
