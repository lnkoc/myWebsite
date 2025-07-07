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
  <div class="comments">
    <h2 class="heading heading--2">Nowe komentarze</h2>
    <template v-for="item in comments" :key="item.COMMENT_ID">
      <div class="container">
        <section class="comment">
          <h3 class="heading heading--3" v-html="item.TITLE"></h3>
          <p><em v-html="item.INTRO"></em></p>
          <p>
            <strong class="info"> Autor: </strong> <span v-html="item.AUTHOR"></span
            ><strong class="info">, Dodano:</strong>
            {{ item.dateAndTime }}
          </p>
          <p><strong class="info">Treść: </strong><span v-html="item.CONTENT"></span></p>
          <button class="btn btn--small" @click="approveComment(item.COMMENT_ID)">
            Zatwierdź komentarz
          </button>
          <button class="btn btn--small" @click="moveCommentToTrash(item.COMMENT_ID)">
            Przenieś do kosza
          </button>
        </section>
      </div>
    </template>
  </div>
  <br />
</template>

<style lang="scss" scoped>
.comments {
  background-color: $secondary-color;
  margin: 10px 0 10px 0;
  padding: 10px;

  @include small-up {
    padding: 20px;
  }

  @include medium-up {
    padding: 30px;
  }

  & .info {
    color: $tertiary-color;
  }

  & .container {
    border-radius: $border-radius;
    background-color: $secondary-background-color;
    margin: 10px;

    @include small-up {
      margin: 20px;
    }

    @include medium-up {
      margin: 30px;
    }

    & .comment {
      padding: 10px;

      & p {
        padding: 10px 0;
      }

      @include small-up {
        padding: 20px;
      }
    }
  }

  & .btn {
    margin: 10px;
  }
}
</style>
