<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
import axios from 'axios'
import CommentsComponent from '@/components/CommentsComponent.vue'
import ImagesGallery from '@/components/ImagesGallery.vue'

const props = defineProps(['articleId'])
const emits = defineEmits('closeArticle')
const link = ref()
const title = ref(null)
const intro = ref(null)
const content = ref(null)
const author = ref(null)
const created = ref(null)
// const isGallery = ref(false)
// const gallery = ref([])

onBeforeMount(() => {})

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
    window.scrollTo(0, 0)
  })
})
function closeArticle() {
  emits('closeArticle')
}
</script>

<template>
  <article class="article">
    <section>
      <h1 v-html="title" class="heading heading--1"></h1>
      <div class="parallax" :style="{ 'background-image': 'url(' + link + ')' }"></div>
      <p class="credentials">
        Autor: {{ author }}, Dodano: <em>{{ created }}</em>
      </p>
    </section>
    <section class="intro">
      <strong v-html="intro"></strong>
    </section>
    <section v-html="content" class="content"></section>
    <ImagesGallery :articleId="props.articleId" class="" />
    <section class="">
      <CommentsComponent :articleId="props.articleId" />
    </section>
    <button @click="closeArticle" class="btn btn-small">&times;</button>
  </article>
</template>

<style lang="scss" scoped>
.article {
  background-color: $secondary-color;
  position: relative;
  z-index: 5;

  & .parallax {
    width: 100%;
    height: 200px;
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  & .heading {
    // margin: 10px 10px 10px 10px;
    padding: 10px 10px;
    text-shadow:
      2px 0px 1px $gray-dark,
      0px 2px 1px $gray-dark,
      -2px 0px 1px $gray-dark,
      0px -2px 1px $gray-dark;
  }

  & .credentials {
    margin: 20px 10px;
  }
  & .intro {
    font-size: $font-size-5;
    margin: 20px 10px;

    @include small-up {
      font-size: $font-size-4;
    }
  }

  & .content {
    font-size: $font-size-5;
    margin: 20px 10px;

    @include small-up {
      font-size: $font-size-4;
    }
  }

  & .btn-small {
    position: absolute;
    color: $secondary-color;
    font-weight: $font-weight-bold;
    font-size: $font-size-1;
    border-radius: 100%;
    width: 64px;
    height: 64px;
    padding: 0;
    margin: 0;
    top: 0;
    right: 0;

    @include medium-up {
      top: -10px;
      right: -10px;
    }
  }
}
</style>
