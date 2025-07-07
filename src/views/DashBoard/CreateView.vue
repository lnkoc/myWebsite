<script setup>
import { ref, reactive, watch } from 'vue'
import axios from 'axios'
import { useSessionStore } from '@/stores/session'
import ChooseHeroImage from '@/components/ChooseHeroImage.vue'
import ChooseImagesToGallery from '@/components/ChooseImagesToGallery.vue'

const session = useSessionStore()
const article = reactive({
  title: ``,
  intro: ``,
  content: ``,
  hero_img: null,
  author: ``,
  hidden: ``,
  createTime: ``
})
const comment = ref()
const showHG = ref(false)
const pathHeroImg = ref(null)
const articleGallery = reactive([])
const showIG = ref(false)
const descIG = ref('Wybierz obrazy')
const isGallery = ref(false)

watch(
  article,
  () => {
    session.useCounter++
  },
  { deep: true }
)

function removeImg(item) {
  articleGallery.splice(articleGallery.indexOf(item), 1)
  session.useCounter++
}

function toggleIG() {
  if (showIG.value) {
    showIG.value = false
    descIG.value = 'Pokarz obrazy'
  } else {
    showIG.value = true
    descIG.value = 'Ukryj obrazy'
  }
  session.useCounter++
}

function addImageToGallery(imgId, imgName) {
  articleGallery.push({ id: imgId, name: imgName })
  session.useCounter++
}

function toggleHeroGallery() {
  if (showHG.value) {
    showHG.value = false
  } else {
    showHG.value = true
  }
  session.useCounter++
}

function setHeroImage(imageId, path) {
  article.hero_img = imageId
  pathHeroImg.value = path
  toggleHeroGallery()
}

function saveArticleAndGallery() {
  if (articleGallery.length > 0) {
    isGallery.value = true
  } else {
    isGallery.value = false
  }
  let imageIds = []
  if (isGallery.value) {
    for (let i = 0; i < articleGallery.length; i++) {
      imageIds.push(articleGallery[i].id)
    }
  }
  axios
    .post('/save-article', {
      params: {
        title: article.title,
        intro: article.intro,
        content: article.content,
        hero_img: article.hero_img,
        author: session.author,
        edit: isGallery.value,
        gallery: imageIds,
        hidden: article.hidden,
        create_time: article.createTime
      }
    })
    .then((res) => {
      article.title = ``
      article.intro = ``
      article.content = ``
      article.hero_img = ''
      article.edit = ''
      pathHeroImg.value = null
      article.hidden = ``
      article.createTime = ``
      articleGallery.splice(0)
      if (showHG.value) {
        toggleHeroGallery()
      }
      if (showIG.value) {
        toggleIG()
      }
      session.note = res.data
      session.useCounter++
    })
}
</script>

<template>
  <div class="create">
    <h2 class="heading heading--2">Utwórz artykuł/szkic</h2>

    <form>
      <label for="hidden"
        ><input class="radio" type="radio" id="hidden" v-model="article.hidden" :value="1" /> Szkic
      </label>

      <label for="visible"
        ><input class="radio" type="radio" id="visible" v-model="article.hidden" :value="0" />
        Artykuł</label
      >
      <br /><br />

      <label for="createTime"
        >Czas dodania:<br />
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
        maxlength="300"
        id="title"
        required
      /><br />

      <label for="intro">Wstęp</label><br />
      <textarea
        class="wide"
        id="intro"
        v-model="article.intro"
        rows="5"
        maxlength="1000"
        requied
      ></textarea
      ><br />

      <label for="content">Treść</label><br />
      <textarea
        class="wide"
        id="content"
        v-model="article.content"
        rows="15"
        maxlength="65535"
        requied
      ></textarea
      ><br />

      <label for="hero">Obraz główny</label><br />
      <img v-if="!showHG && pathHeroImg != null" :src="`/uploads/${pathHeroImg}`" id="hero" /><br />
      <button class="btn" @click.prevent="toggleHeroGallery()">Wybierz obraz</button><br />
      <ChooseHeroImage v-if="showHG" @actualImg="setHeroImage" /><br />

      <label for="articleGallery">Wybierz obrazy do galerii</label>
      <ul id="articleGallery">
        <template v-for="item in articleGallery" :key="item.IMAGE_ID">
          <li>
            <img :src="`/uploads/${item.name}`" @click="removeImg(item)" />
          </li>
        </template>
      </ul>
      <button class="btn" @click.prevent="toggleIG">{{ descIG }}</button>
      <ChooseImagesToGallery v-if="showIG" @add="addImageToGallery" /><br /><br />

      <button class="btn" @click.prevent="saveArticleAndGallery()">Opublikuj</button>
    </form>
    {{ comment }}<br />
  </div>
</template>

<style lang="scss" scoped>
.create {
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
</style>
