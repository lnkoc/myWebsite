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
  <div v-if="!showArticle">
    <ul>
      <li v-for="item in introArticlesList" :key="item.ARTICLE_ID" ref="items">
        <section class="introArticle flex">
          <h1 v-html="item.TITLE" class="heading heading--1"></h1>
          <p class="credentials">
            <em>Autor: {{ item.LOGIN }},</em>
            dodano: {{ item.dateAndTime }} <br />
          </p>
          <img :src="`/uploads/${item.IMAGE_NAME}`" /><br />
          <p class="intro" v-html="item.INTRO"></p>
          <button class="btn" @click="openArticle(item.ARTICLE_ID)">Czytaj całość</button><br />
        </section>
      </li>
    </ul>
    <button :disabled="articlesLoaderBtn" class="btn btn-loader" @click="getMoreIntroArticles(3)">
      {{ articlesLoaderNote }}
    </button>
  </div>
  <ArticleView v-if="showArticle" :articleId="openArticleId" @closeArticle="showList()" />
</template>

<style lang="scss" scoped>
.introArticle {
  background-color: $secondary-color;
  margin: 20px 0px;
  border-radius: $border-radius;
  flex-direction: column;

  & .heading {
    margin: 10px;
  }

  & .credentials {
    margin: 10px;
  }

  & .btn {
    margin: 20px;
    color: $secondary-color;
    font-weight: $font-weight-bold;
  }

  & .intro {
    font-size: $font-size-5;
    margin: 0 10px;

    @include small-up {
      font-size: $font-size-4;
      margin: 0 20px;
    }

    @include medium-up {
      margin: 0 40px;
    }
  }
}

.btn-loader {
  width: 80%;
  align-self: center;
  color: $secondary-color;
  font-weight: $font-weight-bold;
  display: block;
  margin: 40px auto;

  &:disabled {
    background-color: $secondary-color;
    color: $primary-color;
  }
}

img {
  max-width: 100%;
  max-height: 560px;
}
</style>
