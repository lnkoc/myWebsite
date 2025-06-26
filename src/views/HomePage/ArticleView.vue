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
  <article class="article u-mt-40">
    <section>
      <img :src="link" alt="Obrazek" class="u-m-auto" /><br />
      <h1 v-html="title" class="heading--1 u-ml-30 u-mr-30 u-mb-30"></h1>
      <lablel class="u-ml-50 u-mt-20 u-mb-20">
        Autor: {{ author }}, Dodano: <em>{{ created }}</em>
      </lablel>
    </section>
    <section class="intro u-mt-50 u-ml-30 u-mr-30 u-mb-50">
      <strong v-html="intro"></strong>
    </section>
    <section v-html="content" class="content u-mt-30 u-ml-30 u-mr-30 u-mb-30"></section>
    <ImagesGallery :articleId="props.articleId" class="u-mt-50 u-ml-30 u-mr-30 u-mb-50" />
    <section class="u-mt-50 u-ml-30 u-mr-30 u-mb-50">
      <CommentsComponent :articleId="props.articleId" />
    </section>
    <button @click="closeArticle" class="btn btn-small">&times;</button>
  </article>
</template>

<style lang="scss" scoped>
.article {
  background-color: $secondary-color;
  position: relative;
  padding: 5%;
  z-index: 5;

  & img {
    width: 100%;
  }

  & h1 {
    margin-top: -80px;
    text-shadow:
      2px 0px 1px $gray-dark,
      0px 2px 1px $gray-dark,
      -2px 0px 1px $gray-dark,
      0px -2px 1px $gray-dark;
  }

  & .intro {
    font-size: $font-size-3;
  }

  & .content {
    font-size: $font-size-4;
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
      top: -30px;
      right: -30px;
    }
  }
}
</style>
