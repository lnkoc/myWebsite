<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useSessionStore } from '@/stores/session'

const emit = defineEmits('update')
const session = useSessionStore()
const file = ref()

function handler(event) {
  file.value = event.target.files[0]
  console.log('Plik przypisany')
  session.useCounter++
}

function submit() {
  let formData = new FormData()
  formData.append('jumbo', file.value)

  axios
    .post('/send-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((res) => {
      file.value = ''
      session.note = res.data
      emit('update')
    })
    .catch(() => {
      session.note = 'Błąd w przesyłaniu pliku'
      file.value = ''
    })
  session.useCounter++
}
</script>

<template>
  <h3>Wyślij zdjęcie (plik)</h3>
  <form>
    <input type="file" @change="handler($event)" />
    <button @click.prevent="submit()">Prześlij plik</button>
  </form>
  <br />
</template>
