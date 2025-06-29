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
  <h3 class="heading--3">Komentarze</h3>
  <section>
    <template v-for="item in comments" :key="item.COMMENT_ID">
      <br />
      <p class="comment-credentials">
        <span class="author"
          >Dodał(a)<br />
          <strong v-html="item.AUTHOR"></strong></span
        ><span class="date"
          >Data dodania: <br /><em>{{ item.dateAndTime }}</em> </span
        ><br />
      </p>
      <p class="comment-content">
        <span v-html="item.CONTENT"></span>
        <br />
      </p>
    </template>

    <div class="add-comment">A tutaj możesz dodać coś od siebie...</div>
    <form>
      <label for="author">Nickname</label><br />
      <input type="text" id="author" v-model="name" maxlength="40" /><br />
      <label for="text">Treść</label><br />
      <textarea id="text" v-model="text" maxlength="2000"></textarea><br />
      <button @click.prevent="sendComment" class="btn">Wyślij komentarz</button><br />
    </form>
    {{ note }}
  </section>
</template>

<style lang="scss" scoped>
section {
  font-size: $font-size-base;

  @include small-up {
    font-size: $font-size-4;
  }
}

h3 {
  margin: 10px 10px;
}
.comment-credentials {
  margin: 0px 10px;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  & .date {
    flex: 1;
    text-align: right;
    white-space: nowrap;
  }
}
.comment-content {
  padding: 20px;
}
.add-comment {
  font-size: $font-size-5;
  margin: 20px 10px 10px 10px;

  @include small-up {
    font-size: $font-size-4;
  }

  @include medium-up {
    font-size: $font-size-3;
  }
}
form {
  padding: 15px;

  & legend,
  label {
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
    width: 100%;
    outline: none;

    @include small-up {
      font-size: $font-size-4;
    }
  }
}
</style>
