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
        if (comments.value[i].APPROVED == true) {
          comments.value[i].info = 'Tak'
        } else {
          comments.value[i].info = 'Nie'
        }
        if (comments.value[i].TRASHED == true) {
          comments.value[i].infoTrashed = 'Tak'
        } else {
          comments.value[i].infoTrashed = 'Nie'
        }
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
  <h3 class="heading heading--3">Komentarze</h3>
  <template v-for="item in comments" :key="item.COMMENT_ID">
    <div class="comment">
      <span class="info">Utworzono:</span> {{ item.dateAndTime }} <br />
      <span class="info">Dodał: </span> {{ item.AUTHOR }} <br />
      <span class="info">Treść: </span>{{ item.CONTENT }} <br />
      <span class="info">Zatwierdzono: </span>{{ item.info }} <br />
      <span class="info">W koszu: </span>{{ item.infoTrashed }} <br />
      <button
        class="btn-comment"
        @click="approveComment(item.COMMENT_ID)"
        :disabled="item.APPROVED"
      >
        Zatwierdź
      </button>
      <button class="btn-comment" @click="unApprove(item.COMMENT_ID)" :disabled="!item.APPROVED">
        Cofnij zatwierdzenie
      </button>
      <button
        class="btn-comment"
        @click="moveCommentToTrash(item.COMMENT_ID)"
        :disabled="item.TRASHED"
      >
        Przenieś do kosza
      </button>
      <button class="btn-comment" @click="restore(item.COMMENT_ID)" :disabled="!item.TRASHED">
        Przywróć z kosza</button
      ><br />
    </div>
  </template>
  <br />
</template>

<style lang="scss" scoped>
.comment {
  margin: 10px;
  border-radius: $border-radius;
  padding: 10px;
}

.heading {
  padding: 10px;

  @include small-up {
    padding: 20px;
  }

  @include medium-up {
    padding: 30px;
  }
}

.info {
  color: $tertiary-color;
}

.btn-comment {
  @extend .btn;
  margin: 10px 10px;

  &:disabled {
    background-color: $secondary-color;
    color: $primary-color;
    border: 2px solid $tertiary-color;
  }
}
</style>
