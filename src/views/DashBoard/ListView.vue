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
  <div class="list" v-if="!edit">
    <h2 class="heading heading--2">Lista wpisów</h2>
    <ul>
      <li v-for="item in introArticlesList" :key="item.ARTICLE_ID" ref="items">
        <h3 class="heading heading--3" v-html="item.TITLE"></h3>
        <p class="credentials">
          <span class="info">Autor:</span> <em>{{ item.LOGIN }}</em
          >, <span class="info">dodano: </span> {{ item.dateAndTime }}<br />
        </p>
        <img :src="`/uploads/${item.IMAGE_NAME}`" /><br />
        <p class="intro" v-html="item.INTRO"></p>
        <button class="btn" @click="editArticle(item.ARTICLE_ID)">Edytuj całość</button><br />
      </li>
    </ul>
    <button class="btn-loader" :disabled="articlesLoaderBtn" @click="getMoreIntroArticles(10)">
      {{ articlesLoaderNote }}
    </button>
  </div>
  <EditArticle
    v-if="edit"
    :articleId="editArticleId"
    @close-article="showList"
    @reload-list="reloadList"
  />
</template>

<style lang="scss" scoped>
.list {
  background-color: $secondary-color;
  margin: 10px 0;
  padding: 10px;

  @include small-up {
    padding: 20px;
  }

  @include medium-up {
    padding: 30px;
  }
}

.heading {
  margin: 10px;

  @include small-up {
    margin: 20px;
  }

  @include medium-up {
    margin: 30px;
  }
}

ul li {
  background-color: $secondary-background-color;
  margin: 10px;
  border-radius: $border-radius;

  & .heading {
    padding: 10px;

    @include small-up {
      padding: 20px;
    }

    @include medium-up {
      padding: 30px;
    }
  }

  & p {
    text-align: center;
  }
  & .info {
    color: $tertiary-color;
  }

  & img {
    max-width: 100%;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  & .intro {
    margin: 10px;
    padding: 10px;
    font-size: $font-size-base;

    @include small-up {
      font-size: $font-size-4;
      padding: 20px;
    }
  }

  & .btn {
    display: block;
    width: 40%;
    margin-left: auto;
    margin-right: auto;
  }
}

.credentials {
  font-size: $font-size-4;
  padding: 10px;
}

.btn-loader {
  @extend .btn;
  display: block;
  width: 80%;
  margin-left: auto;
  margin-right: auto;

  &:disabled {
    background-color: $secondary-color;
    color: $primary-color;
  }
}
</style>
