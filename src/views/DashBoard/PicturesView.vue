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
  <div class="images">
    <h2 class="heading heading--2">Obrazy</h2>
    <SendFile @update="refresh()" :key="imagesChange" />
    <AllImagesGallery @update="refresh()" :key="imagesChange" />
  </div>
</template>

<style lang="scss" scoped>
.images {
  background-color: $secondary-color;
  margin: 10px 0 10px 0;
  padding: 10px;

  @include small-up {
    padding: 20px;
  }

  @include medium-up {
    padding: 30px;
  }
}

.heading {
  padding: 10px;

  @include small-up {
    padding: 20px;
  }

  @include medium-up {
    padding: 30px;
  }
}
</style>
