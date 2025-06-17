<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useSessionStore } from '@/stores/session'
import axios from 'axios'
import ChooseHeroImage from './ChooseHeroImage.vue'
import ChooseImagesToGallery from './ChooseImagesToGallery.vue'
import EditComments from './EditComments.vue'

const session = useSessionStore()
const props = defineProps(['articleId'])
const emits = defineEmits(['closeArticle', 'reloadList'])

const article = reactive({
  title: ``,
  intro: ``,
  content: ``,
  heroImgId: null,
  heroImg: null,
  author: ``,
  hidden: false,
  createTime: ``
})
const showHG = ref(false)
const showIG = ref(false)
const descIG = ref('Pokaż wszystkie obrazy')

const created = ref()
const isGallery = ref(false)
const articleGallery = reactive([])

onMounted(() => {
  axios.post('/get-entire-article', { params: { articleId: props.articleId } }).then((res) => {
    article.title = res.data[0].TITLE
    article.intro = res.data[0].INTRO
    article.content = res.data[0].CONTENT
    article.author = res.data[0].LOGIN
    article.heroImgId = res.data[0].IMAGE_ID
    article.heroImg = res.data[0].IMAGE_NAME
    article.hidden = res.data[0].HIDDEN
    article.createTime = res.data[0].CREATED_AT.slice(0, 16)

    created.value = res.data[0].CREATED_AT

    let date = created.value.slice(0, 10).split('-').reverse().join('/')
    let time = created.value.slice(11, 16)
    created.value = date + ' ' + time
  })
  axios.post('/get-gallery', { params: { articleId: props.articleId } }).then((res) => {
    if (res.data.length > 0) {
      for (let i = 0; i < res.data.length; i++) {
        articleGallery.push(res.data[i])
      }
      isGallery.value = true
    } else {
      isGallery.value = false
    }
  })
})

watch(
  article,
  () => {
    session.useCounter++
  },
  { deep: true }
)

function setHeroImage(imageId, path) {
  article.heroImgId = imageId
  article.heroImg = path
  showHG.value = !showHG.value
}

function toggleHeroGallery() {
  showHG.value = !showHG.value
  session.useCounter++
}

function addImageToGallery(imgId, imgName) {
  articleGallery.push({ IMAGE_NAME: imgName, IMAGE_ID: imgId })
  isGallery.value = true
  session.useCounter++
}

function removeImg(item) {
  articleGallery.splice(articleGallery.indexOf(item), 1)
  if (articleGallery.length > 0) {
    isGallery.value = true
  } else {
    isGallery.value = false
  }
  session.useCounter++
}
function toggleIG() {
  if (showIG.value) {
    descIG.value = 'Pokaż wszystkie obrazy'
    showIG.value = false
  } else {
    descIG.value = 'Ukryj wszystkie obrazy'
    showIG.value = true
  }
  session.useCounter++
}
function saveArticle() {
  if (isGallery.value) {
    let imageIds = []
    for (let i = 0; i < articleGallery.length; i++) {
      imageIds.push(articleGallery[i].IMAGE_ID)
    }
    axios
      .post('/update-gallery', { params: { articleId: props.articleId, ids: imageIds } })
      .then((res) => {
        session.note = res.data
      })
  }
  axios
    .post('/update-article', {
      params: {
        id: props.articleId,
        title: article.title,
        intro: article.intro,
        content: article.content,
        heroImgId: article.heroImgId,
        author: session.author,
        edit: false,
        hidden: article.hidden,
        createTime: article.createTime
      }
    })
    .then((res) => {
      session.note = res.data
    })
  emits('reloadList', props.articleId)
  session.useCounter++
}

function closeArticle() {
  emits('closeArticle')
}
</script>
<template>
  <h2>
    Edytujesz artykuł o id {{ props.articleId }}, utworzony przez {{ article.author }}, w dniu
    {{ created }}
  </h2>
  <form>
    <label for="hidden"
      ><input type="radio" id="hidden" v-model="article.hidden" :value="1" />Szkic</label
    >
    <label for="visible"
      ><input type="radio" id="visible" v-model="article.hidden" :value="0" />Artykuł</label
    >
    <br />
    <label for="createTime"
      >Czas dodania:
      <input type="datetime-local" id="createTime" v-model="article.createTime" /></label
    ><br />
    <label for="title">Tytuł</label><br />
    <input type="text" v-model="article.title" id="title>" maxlength="300" requied /><br />

    <label for="intro">Wstęp</label><br />
    <textarea id="intro" v-model="article.intro" rows="5" maxlength="1000" required /> <br />

    <label for="content">Treść</label><br />
    <textarea id="content" v-model="article.content" rows="15" maxlength="65535" requied /><br />

    <label for="hero">Obraz główny</label><br />
    <img
      v-if="!showHG && article.heroImg != null"
      :src="`/uploads/${article.heroImg}`"
      id="hero"
    /><br />
    <button @click.prevent="toggleHeroGallery">Wybierz obraz</button><br />
    <ChooseHeroImage v-if="showHG" @actualImg="setHeroImage" /><br />

    <label for="articleGallery">Obrazy w galerii</label>
    <ul id="articleGallery">
      <template v-for="item in articleGallery" :key="item.IMAGE_ID">
        <img :src="`/uploads/${item.IMAGE_NAME}`" @click="removeImg(item)" />
      </template>
    </ul>
    <button @click.prevent="toggleIG">{{ descIG }}</button><br />
    <ChooseImagesToGallery v-if="showIG" @add="addImageToGallery" /><br />
    <br />
    <button @click.prevent="saveArticle">Zatwierdź zmiany</button>
  </form>
  <EditComments :articleId="props.articleId" />

  <br />
  <button class="close" @click="closeArticle">Powrót do listy artykułów</button><br />
</template>

<style scoped>
img {
  width: 384px;
  max-height: 216px;
}
.close {
  padding: 15px;
  background-color: black;
  color: white;
  border-radius: 15px;
  font-weight: bold;
}
</style>
