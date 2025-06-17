<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const emit = defineEmits('add')
const links = ref([])

onMounted(() => {
  axios.post('/all-paths-to-images').then((res) => {
    links.value = res.data
  })
})

function addImage(imgId, imgName) {
  emit('add', imgId, imgName)
}
</script>
<template>
  <ul>
    <template v-for="item in links" :key="item.IMAGE_ID">
      <li>
        <img
          :src="`/uploads/${item.IMAGE_NAME}`"
          @click="addImage(item.IMAGE_ID, item.IMAGE_NAME)"
        />
      </li>
    </template>
  </ul>
</template>
<style scoped>
ul li {
  display: inline;
}
img {
  width: 192px;
  max-height: 108px;
}
</style>
