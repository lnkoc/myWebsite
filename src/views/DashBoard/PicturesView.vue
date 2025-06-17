<script setup>
import { ref } from 'vue'
import SendFile from '@/components/SendFile.vue'
import AllImagesGallery from '@/components/AllImagesGallery.vue'

const imagesChange = ref(0)
function refresh() {
  imagesChange.value++
}
</script>
<template>
  <h2>Obrazy</h2>
  <SendFile @update="refresh()" :key="imagesChange" />
  <h3>Obrazy w galerii</h3>
  <AllImagesGallery @update="refresh()" :key="imagesChange" />
</template>
