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
  <!-- <h2>Elementy w koszu</h2> -->
  <div class="comments">
    <h2 class="heading heading--2">Komentarze w koszu</h2>
    <template v-for="item in trashedComments" :key="item.COMMENT_ID">
      <div class="container">
        <section class="comment">
          <p>
            <strong class="info">Autor: </strong>
            <span v-html="item.AUTHOR"></span><strong class="info">, Dodano: </strong
            >{{ item.dateAndTime }}
          </p>
          <p><strong class="info">Treść: </strong><span v-html="item.CONTENT"></span></p>
          <p><strong class="info">Zatwierdzony:</strong> {{ item.info }}</p>
          <button class="btn btn--small" v-if="item.APPROVED" @click="unApprove(item.COMMENT_ID)">
            Cofnij zatwierdzenie
          </button>
          <button class="btn btn--small" @click="restore(item.COMMENT_ID)">Przywróć z kosza</button>
          <button class="btn btn--small" @click="erase(item.COMMENT_ID)">Usuń całkowicie</button
          ><br />
        </section>
      </div>
    </template>
  </div>
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

      & .info {
        color: $tertiary-color;
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
