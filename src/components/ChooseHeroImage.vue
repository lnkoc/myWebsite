<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const emit = defineEmits('actualImg')

const links = ref([])
// const imageChosen = ref(null)

onMounted(() => {
  axios.post('/all-paths-to-images').then((res) => {
    links.value = res.data
  })
  // imageChosen.value = props.previousImg
})

function close(imageId, imageName) {
  emit('actualImg', imageId, imageName)
}
</script>

<template>
  <ul>
    <template v-for="item in links" :key="item.IMAGE_ID">
      <li>
        <img :src="`/uploads/${item.IMAGE_NAME}`" @click="close(item.IMAGE_ID, item.IMAGE_NAME)" />
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
