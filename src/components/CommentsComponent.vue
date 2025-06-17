<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'

const props = defineProps(['articleId'])
const comments = ref([])
const name = ref('')
const text = ref('')
const note = ref('')

onMounted(() => {
  axios.post('/get-approved-comments', { params: { articleId: props.articleId } }).then((res) => {
    comments.value = res.data

    for (let i = 0; i < comments.value.length; i++) {
      let date = comments.value[i].CREATED_AT.slice(0, 10).split('-').reverse().join('/')
      let time = comments.value[i].CREATED_AT.slice(11, 16)
      comments.value[i].dateAndTime = date + ' ' + time
    }
  })
})

function sendComment() {
  if (name.value == '') {
    note.value = 'Podaj Nickname, bo nie wiemy kto pisze...'
  } else {
    if (text.value == '') {
      note.value = 'Miło Cię widzieć ' + name.value + '. Napisz coś od siebie!'
    } else {
      axios
        .post('/send-comment', {
          params: { articleId: props.articleId, author: name.value, text: text.value }
        })
        .then((res) => {
          note.value = res.data
          name.value = ''
          text.value = ''
        })
    }
  }
}
</script>
<template>
  <h2>Komentarze:</h2>
  <section>
    <template v-for="item in comments" :key="item.COMMENT_ID">
      Data dodania:
      <em>{{ item.dateAndTime }}</em> <br />
      Dodał:
      <strong v-html="item.AUTHOR"></strong> <br />
      <span v-html="item.CONTENT"></span>
      <br />
    </template>
    <strong>Tutaj możesz dodać coś od siebie...</strong>
    <form>
      <label for="author">Nickname</label><br />
      <input type="text" id="author" v-model="name" maxlength="40" /><br />
      <label for="text">Treść</label><br />
      <textarea id="text" v-model="text" maxlength="2000"></textarea><br />
      <button @click.prevent="sendComment">Wyślij komentarz</button><br />
    </form>
    {{ note }}
  </section>
</template>

<style scoped>
section {
  background-color: lightblue;
  padding: 5px;
}
</style>
