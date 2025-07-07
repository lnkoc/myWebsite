<script setup>
import { ref, onMounted, useTemplateRef, nextTick } from 'vue'
import EditDraft from '@/components/EditDraft.vue'
import axios from 'axios'
import { useSessionStore } from '@/stores/session'

const session = useSessionStore()
const introDraftsList = ref([])
let introDraftsIndexList = []
const tempIntroDrafts = ref([])
const itemRefs = useTemplateRef('items')
const editDraftId = ref()
const edit = ref(false)
let lastEditIndex = -1
const offsetDrafts = ref(0)
const fetchDrafts = ref(10)
const draftsLoader = ref('Pobierz kolejne 10 szkiców')
const draftsLoaderBtn = ref(false)

onMounted(() => {
  axios
    .post('/get-intro-drafts', {
      params: { offset: offsetDrafts.value, fetch: fetchDrafts.value }
    })
    .then((res) => {
      tempIntroDrafts.value = res.data
      for (let i = 0; i < tempIntroDrafts.value.length; i++) {
        let date = tempIntroDrafts.value[i].CREATED_AT.slice(0, 10).split('-').reverse().join('/')
        let time = tempIntroDrafts.value[i].CREATED_AT.slice(11, 16)
        tempIntroDrafts.value[i].dateAndTime = date + ' ' + time
        introDraftsList.value.push(tempIntroDrafts.value.at(i))
        introDraftsIndexList.push(tempIntroDrafts.value[i].ARTICLE_ID)
        offsetDrafts.value++
      }
    })
})

function editArticle(id) {
  editDraftId.value = id
  edit.value = true
  session.useCounter++
}

function getMoreIntroDrafts(count) {
  console.log('offset ' + offsetDrafts.value + ' ,count ' + count)
  axios
    .post('/get-intro-drafts', { params: { offset: offsetDrafts.value, fetch: count } })
    .then(async (res) => {
      tempIntroDrafts.value = res.data
      if (res.data.length > 0) {
        for (let i = 0; i < tempIntroDrafts.value.length; i++) {
          let date = tempIntroDrafts.value[i].CREATED_AT.slice(0, 10).split('-').reverse().join('/')
          let time = tempIntroDrafts.value[i].CREATED_AT.slice(11, 16)
          tempIntroDrafts.value[i].dateAndTime = date + ' ' + time
          introDraftsList.value.push(tempIntroDrafts.value[i])
          introDraftsIndexList.push(tempIntroDrafts.value[i].ARTICLE_ID)
          offsetDrafts.value++
        }
      } else {
        draftsLoader.value = 'To już wszystko, co udało się znaleźć...'
        draftsLoaderBtn.value = true
      }
    })
  session.useCounter++
}

function reloadList(id) {
  lastEditIndex = introDraftsIndexList.indexOf(id)
  if (lastEditIndex < introDraftsIndexList.length - 1) {
    introDraftsList.value.splice(lastEditIndex, 1)
    introDraftsIndexList.splice(lastEditIndex, 1)
    lastEditIndex++
  } else {
    introDraftsList.value.splice(lastEditIndex, 1)
    introDraftsIndexList.splice(lastEditIndex, 1)
    lastEditIndex = introDraftsIndexList.length - 1
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
    <h2 class="heading heading--2">LISTA SZKICÓW</h2>
    <ul>
      <li v-for="item in introDraftsList" :key="item.ARTICLE_ID" ref="items">
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
    <button class="btn-loader" :disabled="draftsLoaderBtn" @click="getMoreIntroDrafts(10)">
      {{ draftsLoader }}
    </button>
  </div>
  <EditDraft
    v-if="edit"
    :articleId="editDraftId"
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
