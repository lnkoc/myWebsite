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
    <h3 class="heading--3">Galeria</h3>
    <ul>
      <li v-for="item in gallery" :key="item.IMAGE_ID">
        <img :src="`/uploads/${item.IMAGE_NAME}`" alt="Obrazek" @click="openImage(item)" />
      </li>
    </ul>
    <div v-if="imgActive" class="modal">
      <img :src="`/uploads/${imgPath}`" alt="Powiększony obraz" />
      <button @click="closeImage" class="btn btn--small">&times;</button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
ul li {
  display: inline;
  margin-inline: 5px;

  & img {
    width: 155px;
    height: auto;
    border-radius: 10px;
    padding: 5px;

    &:hover {
      opacity: 0.8;
      cursor: pointer;
    }
  }
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 100%;
  height: auto;
  background-color: $gray-dark;

  & img {
    // display: flex;
    // margin: auto;/
    max-width: 90%;
    max-height: 90%;
  }

  & .btn--small {
    position: fixed;
    color: $secondary-color;
    font-weight: $font-weight-bold;
    font-size: $font-size-1;
    border-radius: 100%;
    width: 64px;
    height: 64px;
    padding: 0;
    margin: 0;
    top: 1%;
    right: 1%;
  }
}
</style>
