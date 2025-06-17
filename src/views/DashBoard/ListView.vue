<script setup>
import { ref, onMounted, useTemplateRef, nextTick } from 'vue'
import EditArticle from '@/components/EditArticle.vue'
import axios from 'axios'
import { useSessionStore } from '@/stores/session'

const session = useSessionStore()
const introArticlesList = ref([])
let introArticlesIndexList = []
const tempIntroArticles = ref([])
const itemRefs = useTemplateRef('items')
const editArticleId = ref()
const edit = ref(false)
let lastEditIndex = -1
const offsetArticles = ref(0)
const fetchArticles = ref(10)
const articlesLoaderNote = ref('Pobierz kolejne 10 wpisów')
const articlesLoaderBtn = ref(false)

function editArticle(id) {
  console.log('Edytuję artykuł o id = ' + id)
  editArticleId.value = id
  edit.value = true
}

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
        introArticlesList.value.push(tempIntroArticles.value.at(i))
        introArticlesIndexList.push(tempIntroArticles.value[i].ARTICLE_ID)
        offsetArticles.value++
      }
    })
})

function getMoreIntroArticles(count) {
  // console.log('offset ' + offsetArticles.value + ' ,count ' + count)
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
          introArticlesIndexList.push(tempIntroArticles.value[i].ARTICLE_ID)
          offsetArticles.value++
        }
      } else {
        articlesLoaderNote.value = 'To już wszystko, co udało się znaleźć...'
        articlesLoaderBtn.value = true
      }
    })
  session.useCounter++
}

function reloadList(id) {
  lastEditIndex = introArticlesIndexList.indexOf(id)
  if (lastEditIndex < introArticlesIndexList.length - 1) {
    introArticlesList.value.splice(lastEditIndex, 1)
    introArticlesIndexList.splice(lastEditIndex, 1)
    lastEditIndex++
  } else {
    introArticlesList.value.splice(lastEditIndex, 1)
    introArticlesIndexList.splice(lastEditIndex, 1)
    lastEditIndex = introArticlesIndexList.length - 1
  }
}

async function showList() {
  edit.value = false
  await nextTick()
  itemRefs.value.at(lastEditIndex).scrollIntoView({ behavior: 'instant' })
  session.useCounter++
}
</script>

<template>
  <main v-if="!edit">
    <h2>Lista wpisów</h2>
    <ul>
      <li v-for="item in introArticlesList" :key="item.ARTICLE_ID" ref="items">
        <h3 v-html="item.TITLE"></h3>
        <em>{{ item.LOGIN }}</em
        ><br />
        Opublikowano: {{ item.dateAndTime }}<br />
        <img :src="`/uploads/${item.IMAGE_NAME}`" /><br />
        <strong v-html="item.INTRO"></strong><br />
        <button @click="editArticle(item.ARTICLE_ID)">Edytuj całość</button><br />
      </li>
    </ul>
    <button :disabled="articlesLoaderBtn" @click="getMoreIntroArticles(10)">
      {{ articlesLoaderNote }}
    </button>
  </main>
  <EditArticle
    v-if="edit"
    :articleId="editArticleId"
    @close-article="showList"
    @reload-list="reloadList"
  />
</template>

<style scoped>
img {
  width: 384px;
  max-height: 216px;
}
</style>
