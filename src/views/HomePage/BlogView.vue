<script setup>
import { onMounted, ref, useTemplateRef, nextTick } from 'vue'
import axios from 'axios'
import ArticleView from './ArticleView.vue'

const introArticlesList = ref([])
let introArticlesIndex = []
const tempIntroArticles = ref([])
const openArticleId = ref()
const showArticle = ref(false)
const offsetArticles = ref(0) //pomija liczbę wyników
const fetchArticles = ref(3) //pobiera liczbę wyników
const articlesLoaderBtn = ref(false)
const articlesLoaderNote = ref('Pobierz więcej')
const itemRefs = useTemplateRef('items')

onMounted(() => {
  axios
    .post('/get-intro-articles', {
      params: { offset: offsetArticles.value, fetch: fetchArticles.value }
    })
    .then((res) => {
      tempIntroArticles.value = res.data
      for (let i = 0; i < tempIntroArticles.value.length; i++) {
        let date = tempIntroArticles.value[i].CREATED_AT.slice(0, 10).split('-').reverse().join('/')
        let time = tempIntroArticles.value[i].CREATED_AT.slice(11, 16)
        tempIntroArticles.value[i].dateAndTime = date + ' ' + time
        introArticlesList.value.push(tempIntroArticles.value[i])
        introArticlesIndex.push(tempIntroArticles.value[i].ARTICLE_ID)
        offsetArticles.value++
      }
    })
})

function getMoreIntroArticles(count) {
  console.log('offset ' + offsetArticles.value + ' ,count ' + count)
  axios
    .post('/get-intro-articles', { params: { offset: offsetArticles.value, fetch: count } })
    .then(async (res) => {
      tempIntroArticles.value = res.data
      if (res.data.length > 0) {
        for (let i = 0; i < tempIntroArticles.value.length; i++) {
          let date = tempIntroArticles.value[i].CREATED_AT.slice(0, 10)
            .split('-')
            .reverse()
            .join('/')
          let time = tempIntroArticles.value[i].CREATED_AT.slice(11, 16)
          tempIntroArticles.value[i].dateAndTime = date + ' ' + time
          introArticlesList.value.push(tempIntroArticles.value[i])
          introArticlesIndex.push(tempIntroArticles.value[i].ARTICLE_ID)
          offsetArticles.value++
        }
      } else {
        articlesLoaderNote.value = 'To już wszystko, co udało się znaleźć...'
        articlesLoaderBtn.value = true
      }
    })
}

function openArticle(id) {
  showArticle.value = true
  openArticleId.value = id
}

async function showList() {
  showArticle.value = false
  await nextTick()
  let search = openArticleId.value
  let index = introArticlesIndex.indexOf(search)
  itemRefs.value.at(index).scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <h1>Blog</h1>
  <main v-if="!showArticle">
    <ul>
      <li v-for="item in introArticlesList" :key="item.ARTICLE_ID" ref="items">
        <h2 v-html="item.TITLE"></h2>
        <em>Autor: {{ item.LOGIN }}</em>
        Dodano: {{ item.dateAndTime }}<br />
        <img :src="`/uploads/${item.IMAGE_NAME}`" /><br />
        <strong v-html="item.INTRO"></strong>
        <br />
        <button @click="openArticle(item.ARTICLE_ID)">Czytaj całość</button><br />
      </li>
    </ul>
    <button :disabled="articlesLoaderBtn" @click="getMoreIntroArticles(3)">
      {{ articlesLoaderNote }}
    </button>
  </main>
  <ArticleView v-if="showArticle" :articleId="openArticleId" @closeArticle="showList()" />
</template>

<style scoped>
img {
  width: 384px;
}
ul {
  list-style-type: none;
}
</style>
