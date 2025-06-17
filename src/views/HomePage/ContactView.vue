<script setup>
import { ref } from 'vue'
import axios from 'axios'

const email = ref(null)
const text = ref(null)
const note = ref(null)

function sendEmail() {
  axios
    .post('/email', {
      params: {
        email: email.value,
        text: text.value
      }
    })
    .then(function (response) {
      if (response.status == '200') {
        note.value = 'Wysłano wiadomość'
        email.value = null
        text.value = null
      } else {
        note.value = `Ups... najwyraźniej coś poszło nie tak. Odpowiedź serwera: ${response.status}`
      }
    })
    .catch(function (error) {
      note.value = error
    })
}
</script>

<template>
  <h1>Kontakt</h1>
  <form>
    <label for="email">Twój email</label><br />
    <input disabled type="email" id="email" v-model="email" /><br />
    <label for="text">Treść wiadomości</label><br />
    <textarea disabled id="text" v-model="text" /><br />
    <button id="submit" @click.prevent="sendEmail">Wyślij</button>
  </form>
  {{ note }}
</template>
