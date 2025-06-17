<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useSessionStore } from '@/stores/session'

const comments = ref([])
const session = useSessionStore()

onMounted(() => {
  getComments()
})

function getComments() {
  axios.post('/get-unauthorised-comments').then((res) => {
    comments.value = res.data
    for (let i = 0; i < comments.value.length; i++) {
      let date = comments.value[i].CREATED_AT.slice(0, 10).split('-').reverse().join('/')
      let time = comments.value[i].CREATED_AT.slice(11, 16)
      comments.value[i].dateAndTime = date + ' ' + time
    }
  })
}

function approveComment(id) {
  axios.get('/approve-comment', { params: { commentId: id } }).then((res) => {
    session.note = res.data
    session.useCounter++
    setTimeout(() => {
      getComments()
    }, '800')
  })
}

function moveCommentToTrash(id) {
  axios.get('/move-comment-to-trash', { params: { commentId: id } }).then((res) => {
    session.note = res.data
    session.useCounter++
    setTimeout(() => {
      getComments()
    }, '800')
  })
}
</script>

<template>
  <h2>Podsumowanie</h2>
  <h3>Nowe komentarze</h3>
  <template v-for="item in comments" :key="item.COMMENT_ID">
    <h3 v-html="item.TITLE"></h3>
    <em v-html="item.INTRO"></em><br />
    <span v-html="item.AUTHOR"></span> {{ item.dateAndTime }}<br />
    <span v-html="item.CONTENT"></span><br />
    <button @click="approveComment(item.COMMENT_ID)">Zatwierdź komentarz</button><br />
    <button @click="moveCommentToTrash(item.COMMENT_ID)">Przenieś do kosza</button><br />
  </template>
  <br />
</template>
