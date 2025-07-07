<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useSessionStore } from '@/stores/session'
const emit = defineEmits('update')
const session = useSessionStore()
const links = ref([])

onMounted(() => {
  axios.post('/all-paths-to-images').then((res) => {
    links.value = res.data

    if (res.data.length > 0) {
      for (let i = 0; i < links.value.length; i++) {
        let date = links.value[i].CREATED.slice(0, 10).split('-').reverse().join('/')
        let time = links.value[i].CREATED.slice(11, 16)
        links.value[i].dateAndTime = date + ' ' + time
      }
    }
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
  <h3 class="heading heading--3">Zarządzaj obrazami</h3>
  <ul>
    <template v-for="item in links" :key="item.IMAGE_ID">
      <li>
        <img :src="`/uploads/${item.IMAGE_NAME}`" alt="Obrazek" /><br />
        <div class="desc">
          <strong class="info">Dodano:</strong> {{ item.dateAndTime }}<br />
          <strong class="info">Liczba dowiązań hero:</strong> {{ item.COUNT_H }}<br />
          <strong class="info">Liczba dowiązań w galeriach:</strong> {{ item.COUNT_G }} <br />
          <button class="btn btn--small" @click="deleteImage(item.IMAGE_ID)">
            Usuń zdjęcie z galerii</button
          ><br />
        </div>
      </li>
    </template>
  </ul>
</template>

<style lang="scss" scoped>
.heading {
  margin: 10px;

  @include small-up {
    margin: 20px;
  }

  @include medium-up {
    margin: 30px;
  }
}

ul li {
  margin: 10px 10px;
  background-color: $secondary-background-color;
  border-radius: $border-radius;
  display: inline-block;

  & .info {
    color: $tertiary-color;
  }
}

.desc {
  padding: 10px;
}

img {
  max-width: 300px;
}
</style>
