<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps(['articleId'])
const gallery = ref([])
const isGallery = ref(null)
const imgActive = ref(null)
const imgPath = ref()

onMounted(() => {
  axios.post('/get-gallery', { params: { articleId: props.articleId } }).then((res) => {
    gallery.value = res.data
    if (gallery.value.length > 0) {
      isGallery.value = true
    } else {
      isGallery.value = false
    }
  })
})

function openImage(item) {
  imgActive.value = true
  imgPath.value = item.IMAGE_NAME
}

function closeImage() {
  imgActive.value = false
}
</script>
<template>
  <section v-if="isGallery">
    <h2>Galeria</h2>
    <ul>
      <li v-for="item in gallery" :key="item.IMAGE_ID">
        <img :src="`/uploads/${item.IMAGE_NAME}`" alt="Obrazek" @click="openImage(item)" />
      </li>
    </ul>
    <div v-if="imgActive">
      <img :src="`/uploads/${imgPath}`" class="modal" alt="Powiększony obraz" />
      <span @click="closeImage" class="close">&times;</span>
    </div>
  </section>
</template>

<style scoped>
h2 {
  color: aliceblue;
}

ul li {
  display: inline;
  margin-inline: 5px;
}

ul li img {
  width: 155px;
  height: auto;
  border-radius: 10px;
  padding: 5px;
}

ul li img:hover {
  opacity: 0.8;
  cursor: pointer;
}

.modal {
  margin: auto;
  width: 80%;
  height: auto;
  background-color: rgba(0, 0, 0, 0.9);
}
.close {
  position: fixed;
  padding: 10px;
  top: 10px;
  right: 10px;
  font-size: 40px;
  font-weight: bold;
  color: whitesmoke;
  background-color: black;
  border-radius: 10px;
  cursor: pointer;
}
</style>
