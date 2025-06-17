<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useSessionStore } from '@/stores/session'
const emit = defineEmits('update')
const session = useSessionStore()
const links = ref([])

// TODO liczba dowiązań - funkcja tutaj i na serwerze

onMounted(() => {
  axios.post('/all-paths-to-images').then((res) => {
    links.value = res.data
  })
})

function deleteImage(id) {
  axios.get('/delete-image', { params: { id: id } }).then((res) => {
    session.note = res.data
    session.useCounter++
  })
  emit('update')
}
</script>
<template>
  <h4>Zarządzaj obrazami</h4>
  <template v-for="item in links" :key="item.IMAGE_ID">
    <img :src="`/uploads/${item.IMAGE_NAME}`" alt="Obrazek" /><br />
    Dodano: {{ item.CREATED }}<br />
    Liczba dowiązań hero: {{ item.COUNT_H }}<br />
    Liczba dowiązań w galeriach: {{ item.COUNT_G }} <br />
    <button @click="deleteImage(item.IMAGE_ID)">Usuń zdjęcie z galerii</button><br />
  </template>
</template>

<style scoped>
img {
  width: 400px;
}
</style>
