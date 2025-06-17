<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useSessionStore } from '@/stores/session'

const props = defineProps(['articleId'])
const session = useSessionStore()
const comments = ref([])

onMounted(() => {
  loadComments()
})

function loadComments() {
  axios.post('/get-all-comments', { params: { articleId: props.articleId } }).then((res) => {
    comments.value = res.data
    if (comments.value.length > 0) {
      for (let i = 0; i < comments.value.length; i++) {
        let date = comments.value[i].CREATED_AT.slice(0, 10).split('-').reverse().join('/')
        let time = comments.value[i].CREATED_AT.slice(11, 16)
        comments.value[i].dateAndTime = date + ' ' + time
      }
    }
  })
}

function approveComment(id) {
  axios.get('/approve-comment', { params: { commentId: id } }).then((res) => {
    session.note = res.data
    session.useCounter++
    setTimeout(() => {
      loadComments()
    }, '800')
  })
}

function moveCommentToTrash(id) {
  axios.get('/move-comment-to-trash', { params: { commentId: id } }).then((res) => {
    session.note = res.data
    session.useCounter++
    setTimeout(() => {
      loadComments()
    }, '800')
  })
}

function unApprove(id) {
  axios.get('/un-approve-comment', { params: { commentId: id } }).then((res) => {
    session.note = res.data
    session.useCounter++
    setTimeout(() => {
      loadComments()
    }, '800')
  })
}

function restore(id) {
  axios.get('/restore-comment', { params: { commentId: id } }).then((res) => {
    session.note = res.data
    session.useCounter++
    setTimeout(() => {
      loadComments()
    }, '800')
  })
}
</script>
<template>
  <h3>Komentarze</h3>
  <template v-for="item in comments" :key="item.COMMENT_ID">
    Utworzono: {{ item.dateAndTime }} <br />
    Dodał: {{ item.AUTHOR }} <br />
    {{ item.CONTENT }} <br />
    Zatwierdzono: {{ item.APPROVED }} <br />
    W koszu: {{ item.TRASHED }} <br />
    <button @click="approveComment(item.COMMENT_ID)" :disabled="item.APPROVED">Zatwierdź</button>
    <button @click="unApprove(item.COMMENT_ID)" :disabled="!item.APPROVED">
      Cofnij zatwierdzenie</button
    ><br />
    <button @click="moveCommentToTrash(item.COMMENT_ID)" :disabled="item.TRASHED">
      Przenieś do kosza
    </button>
    <button @click="restore(item.COMMENT_ID)" :disabled="!item.TRASHED">Przywróć z kosza</button
    ><br />
  </template>
  <br />
</template>
