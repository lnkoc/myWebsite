import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import axios from 'axios'

export const useSessionStore = defineStore('session', () => {
  const currentSession = ref()
  const useCounter = ref(0)
  const isAuth = ref(false)
  const author = ref()
  const note = ref('Jakieś wieści, Panie?')
  let loginLoop = null
  let waiter = null

  function loggedLoop() {
    if (useCounter.value > 0) {
      update()
      useCounter.value = 0
      loginLoop = setTimeout(loggedLoop, 29 * 60 * 1000)
    } else {
      clear()
    }
  }

  watch(note, () => {
    waiter = setTimeout(clearNote, 3000)
  })

  function clearNote() {
    note.value = 'Jakieś wieści, Panie?'
  }

  function set(token, id) {
    currentSession.value = token
    author.value = id
    isAuth.value = true
    note.value = 'Zalogowany użytkownik o id ' + author.value
    loginLoop = setTimeout(loggedLoop, 29 * 60 * 1000)
  }

  function clear() {
    axios
      .get('/logout', {
        params: {
          token: currentSession.value
        },
        withCredentials: true
      })
      .then((res) => {
        if (res.data == 401) {
          console.log(res.data)
        }
      })
    author.value = null
    currentSession.value = null
    isAuth.value = false
    clearTimeout(loginLoop)
    clearTimeout(waiter)
  }

  function update() {
    axios
      .get('/update-token', {
        params: {
          token: currentSession.value
        },
        withCredentials: true
      })
      .then((res) => {
        console.log(res.data.status)
        switch (res.data.status) {
          case 200: //ok
            currentSession.value = res.data.token
            break
          case 401: //nieautoryzowany
            currentSession.value = null
            isAuth.value = false
            clearTimeout(loginLoop)
            break
        }
      })
    return isAuth.value
  }
  return { isAuth, author, note, useCounter, set, clear, update }
})
