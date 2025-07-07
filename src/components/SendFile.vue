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
  <h3 class="heading heading--3">Wyślij zdjęcie (plik)</h3>
  <form>
    <input type="file" @change="handler($event)" /><br />
    <button class="btn btn--small" @click.prevent="submit()">Prześlij plik</button>
  </form>
  <br />
</template>

<style lang="scss" scoped>
.heading {
  padding: 10px;

  @include small-up {
    padding: 20px;
  }

  @include medium-up {
    padding: 30px;
  }
}

.btn {
  margin-left: 20px;

  @include small-up {
    margin-left: 30px;
  }

  @include medium-up {
    margin-left: 40px;
  }
}

::file-selector-button {
  background-color: $primary-button-color;
  color: $secondary-color;
  padding: 10px 15px;
  display: inline-block;
  cursor: pointer;
  border: 2px solid transparent;
  text-align: center;
  font-size: $font-size-5;
  font-weight: $font-weight-light;
  border-radius: $border-radius;
  margin: 5px 10px;
  transition:
    background-color 0.2s ease-in-out,
    border 0.2s ease-in-out,
    0.2s ease-in-out;

  &:hover {
    color: $secondary-color;
    background-color: $primary-color;
    border-color: $primary-button-color;
  }
}

input {
  font-size: $font-size-base;
  padding: 10px;

  @include small-up {
    padding: 20px;
  }

  @include medium-up {
    padding: 30px;
  }
}
</style>
