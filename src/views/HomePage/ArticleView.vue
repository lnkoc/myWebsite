<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import CommentsComponent from '@/components/CommentsComponent.vue'
import ImagesGallery from '@/components/ImagesGallery.vue'

const props = defineProps(['articleId'])
const emits = defineEmits('closeArticle')
const link = ref(null)
const title = ref(null)
const intro = ref(null)
const content = ref(null)
const author = ref(null)
const created = ref(null)
// const isGallery = ref(false)
// const gallery = ref([])

onMounted(() => {
  axios.post('/get-entire-article', { params: { articleId: props.articleId } }).then((res) => {
    link.value = '/uploads/' + res.data[0].IMAGE_NAME
    title.value = res.data[0].TITLE
    intro.value = res.data[0].INTRO
    content.value = res.data[0].CONTENT
    author.value = res.data[0].LOGIN
    created.value = res.data[0].CREATED_AT

    let date = created.value.slice(0, 10).split('-').reverse().join('/')
    let time = created.value.slice(11, 16)
    created.value = date + ' ' + time
  })
})
function closeArticle() {
  emits('closeArticle')
}
</script>

<template>
  <article>
    <section>
      <h2 v-html="title"></h2>
      Dodano: <em>{{ created }}</em> Autor: {{ author }}<br />
      <img :src="link" alt="Obrazek" /><br />
    </section>
    <section>
      <strong v-html="intro"></strong>
    </section>
    <section v-html="content"></section>
    <ImagesGallery :articleId="props.articleId" />
    <section>
      <CommentsComponent :articleId="props.articleId" />
    </section>
    <button @click="closeArticle">&times; Powrót</button>
  </article>
</template>

<style scoped>
article {
  background-color: rgba(0, 0, 0, 0.95);
  position: absolute;
  top: 5%;
  padding: 5%;
  z-index: 5;
}

img {
  width: 50%;
  height: auto;
}

section {
  background-color: whitesmoke;
  padding: 1%;
}

button {
  padding: 15px;
  background-color: black;
  color: white;
  border-radius: 10%;
  font-weight: bold;
  position: fixed;
  top: 20%;
  right: 15%;
}
</style>
