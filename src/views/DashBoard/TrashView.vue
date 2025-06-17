<script setup>
import { ref, onMounted } from 'vue'
import { useSessionStore } from '@/stores/session'
import axios from 'axios'

const trashedComments = ref([])
const session = useSessionStore()

onMounted(() => {
  getTrashedComments()
})

function getTrashedComments() {
  axios.post('/get-trashed-comments').then((res) => {
    trashedComments.value = res.data
    for (let i = 0; i < trashedComments.value.length; i++) {
      let date = trashedComments.value[i].CREATED_AT.slice(0, 10).split('-').reverse().join('/')
      let time = trashedComments.value[i].CREATED_AT.slice(11, 16)
      trashedComments.value[i].dateAndTime = date + ' ' + time
      if (trashedComments.value[i].APPROVED == true) {
        trashedComments.value[i].info = 'Tak'
      } else {
        trashedComments.value[i].info = 'Nie'
      }
    }
  })
}

function unApprove(id) {
  axios.get('/un-approve-comment', { params: { commentId: id } }).then((res) => {
    session.note = res.data
    session.useCounter++
    setTimeout(() => {
      getTrashedComments()
    }, '800')
  })
}

function restore(id) {
  axios.get('/restore-comment', { params: { commentId: id } }).then((res) => {
    session.note = res.data
    session.useCounter++
    setTimeout(() => {
      getTrashedComments()
    }, '800')
  })
}

function erase(id) {
  axios.get('/erase-comment', { params: { commentId: id } }).then((res) => {
    session.note = res.data
    session.useCounter++
    setTimeout(() => {
      getTrashedComments()
    }, '800')
  })
}
</script>
<template>
  <h2>Elementy w koszu</h2>
  <h3>Komentarze</h3>
  <template v-for="item in trashedComments" :key="item.COMMENT_ID">
    Autor: <span v-html="item.AUTHOR"></span> {{ item.dateAndTime }}<br />
    <span v-html="item.CONTENT"></span> <br />
    Zatwierdzony? {{ item.info }} <br />
    <button v-if="item.APPROVED" @click="unApprove(item.COMMENT_ID)">Cofnij zatwierdzenie</button>
    <button @click="restore(item.COMMENT_ID)">Przywróć z kosza</button>
    <button @click="erase(item.COMMENT_ID)">Usuń całkowicie</button><br />
  </template>
</template>
