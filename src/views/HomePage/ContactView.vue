<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'

const email = ref(null)
const text = ref(null)
const note = ref(null)

watch(email, (newEmail) => {
  let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
  if (reg.test(newEmail)) {
    note.value = 'Adres email OK'
  } else {
    note.value = 'Podaj poprawny adres email'
  }
})

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
  <section class="contact">
    <h1 class="heading heading--1">Kontakt</h1>
    <form>
      <label for="email">Twój adres email</label><br />
      <input type="email" id="email" v-model="email" disabled /><br />
      <label for="text">Treść wiadomości</label><br />
      <textarea id="text" v-model="text" rows="6" maxlength="3000" disabled /><br />
      <button class="btn" id="submit" @click.prevent="sendEmail" disabled>Wyślij</button><br />
      {{ note }}
    </form>
  </section>
</template>

<style lang="scss" scoped>
.contact {
  font-size: $font-size-base;
  background-color: $secondary-color;
  margin-top: 10px;
  padding: 10px;

  @include small-up {
    font-size: $font-size-4;
    padding: 20px;
  }

  @include medium-up {
    padding: 40px;
  }

  form {
    padding: 10px;

    & legend,
    label {
      font-size: $font-size-base;

      @include small-up {
        font-size: $font-size-4;
      }
    }
    & input,
    textarea {
      padding: 10px;
      border: 1px solid $secondary-background-color;
      font-size: $font-size-base;
      color: $secondary-color;
      width: 100%;
      outline: none;
      resize: none;

      @include small-up {
        font-size: $font-size-4;
      }
    }
  }
}

.heading {
  margin: 10px;

  // @include small-up {
  //   margin: 20px 20px;
  // }

  // @include medium-up {
  //   margin: 40px 40px;
  // }
}
</style>
