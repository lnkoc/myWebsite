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
  hidden: ``,
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

watch(article, () => {
  session.useCounter++
})

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
  <div class="edit">
    <h2 class="heading heading--2">
      Edytujesz szkic tworzony przez {{ article.author }}, z dnia {{ created }}.
    </h2>
    <form>
      <label for="hidden"
        ><input class="radio" type="radio" id="hidden" v-model="article.hidden" :value="1" />
        Szkic</label
      >
      <label for="visible"
        ><input class="radio" type="radio" id="visible" v-model="article.hidden" :value="0" />
        Artykuł</label
      >
      <br /><br />
      <label for="createTime"
        >Czas dodania:
        <input
          class="wide"
          type="datetime-local"
          id="createTime"
          v-model="article.createTime" /></label
      ><br />
      <label for="title">Tytuł</label><br />
      <input
        class="wide"
        type="text"
        v-model="article.title"
        id="title>"
        maxlength="300"
        requied
      /><br />

      <label for="intro">Wstęp</label><br />
      <textarea
        class="wide"
        id="intro"
        v-model="article.intro"
        rows="5"
        maxlength="1000"
        required
      />
      <br />

      <label for="content">Treść</label><br />
      <textarea
        class="wide"
        id="content"
        v-model="article.content"
        rows="15"
        maxlength="65535"
        requied
      /><br />

      <label for="hero">Obraz główny</label><br />
      <img
        v-if="!showHG && article.heroImg != null"
        :src="`/uploads/${article.heroImg}`"
        id="hero"
      /><br />
      <button class="btn" @click.prevent="toggleHeroGallery">Wybierz obraz</button><br />
      <ChooseHeroImage v-if="showHG" @actualImg="setHeroImage" /><br />

      <label for="articleGallery">Obrazy w galerii</label>
      <ul id="articleGallery">
        <template v-for="item in articleGallery" :key="item.IMAGE_ID">
          <img :src="`/uploads/${item.IMAGE_NAME}`" @click="removeImg(item)" />
        </template>
      </ul>
      <button class="btn" @click.prevent="toggleIG">{{ descIG }}</button><br />
      <ChooseImagesToGallery v-if="showIG" @add="addImageToGallery" /><br />
      <br />
      <button class="btn" @click.prevent="saveArticle">Zatwierdź zmiany</button>
    </form>
    <EditComments :articleId="props.articleId" />

    <br />
    <button class="btn-close" @click="closeArticle">Powrót do listy szkiców</button><br />
  </div>
</template>

<style lang="scss" scoped>
.edit {
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

.heading,
form {
  margin: 10px;

  @include small-up {
    margin: 20px;
  }

  @include medium-up {
    margin: 30px;
  }
}

form {
  padding: 15px;

  & label {
    padding: 0 10px;
    font-size: $font-size-base;

    @include small-up {
      font-size: $font-size-4;
    }
  }
  & input,
  textarea {
    padding: 10px;
    border: 1px solid $secondary-background-color;
    font-size: $font-size-base;
    color: $secondary-color;
    outline: none;
    resize: none;

    &.wide {
      width: 100%;
    }

    @include small-up {
      font-size: $font-size-4;
    }
  }
}

ul li {
  display: inline;
}
img {
  max-width: 192px;
  height: auto;
}
.btn-close {
  @extend .btn;
  display: block;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}
</style>
