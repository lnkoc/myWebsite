<script setup>
import { ref } from 'vue'

const refreshKey = ref(0)
const isVisible = ref(true)
const active = ref(0)

function toggleMenu() {
  isVisible.value = !isVisible.value
}

function setActive(element) {
  active.value = element
}
</script>
<template>
  <div class="main-container">
    <header class="header">
      <div class="container-mobile">
        <button
          :class="{ visible: isVisible }"
          class="hamburger container-mobile__btn"
          @click="toggleMenu"
        >
          <svg
            width="40px"
            height="40px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#1c2774c"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />

            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

            <g id="SVGRepo_iconCarrier">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M20.75 7C20.75 7.41421 20.4142 7.75 20 7.75L4 7.75C3.58579 7.75 3.25 7.41421 3.25 7C3.25 6.58579 3.58579 6.25 4 6.25L20 6.25C20.4142 6.25 20.75 6.58579 20.75 7Z"
                fill="#1C274C"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M20.75 12C20.75 12.4142 20.4142 12.75 20 12.75L4 12.75C3.58579 12.75 3.25 12.4142 3.25 12C3.25 11.5858 3.58579 11.25 4 11.25L20 11.25C20.4142 11.25 20.75 11.5858 20.75 12Z"
                fill="#1C274C"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M20.75 17C20.75 17.4142 20.4142 17.75 20 17.75L4 17.75C3.58579 17.75 3.25 17.4142 3.25 17C3.25 16.5858 3.58579 16.25 4 16.25L20 16.25C20.4142 16.25 20.75 16.5858 20.75 17Z"
                fill="#1C274C"
              />
            </g>
          </svg>
        </button>
        <button
          :class="{ visible: !isVisible }"
          class="hamburger container-mobile__btn"
          @click="toggleMenu"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.1725 7.999L0.5865 3.413C-0.1955 2.633 -0.1955 1.365 0.5865 0.585C1.3665 -0.195 2.6345 -0.195 3.4145 0.585L8.0005 5.171L12.5865 0.585C13.3665 -0.195 14.6345 -0.195 15.4145 0.585C16.1945 1.365 16.1945 2.633 15.4145 3.413L10.8285 7.999L15.4145 12.585C16.1945 13.365 16.1945 14.633 15.4145 15.413C14.6345 16.193 13.3665 16.193 12.5865 15.413L8.0005 10.827L3.4145 15.413C2.6345 16.193 1.3665 16.193 0.5865 15.413C-0.1955 14.633 -0.1955 13.365 0.5865 12.585L5.1725 7.999Z"
              fill="#5956E9"
            />
          </svg>
        </button>
      </div>
      <div :class="{ 'nav-wrapper--mobile': !isVisible }" class="nav-wrapper">
        <nav class="navigation">
          <ul>
            <li>
              <RouterLink to="/blog" :class="{ active: active == 1 }" @click="setActive(1)"
                >Blog</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/webgl" :class="{ active: active == 2 }" @click="setActive(2)"
                >WebGL</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/hobby" :class="{ active: active == 3 }" @click="setActive(3)"
                >Hobby</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/about" :class="{ active: active == 4 }" @click="setActive(4)"
                >O mnie</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/contact" :class="{ active: active == 5 }" @click="setActive(5)"
                >Kontakt</RouterLink
              >
            </li>
          </ul>
          <button class="btn btn--small header__btn">
            <RouterLink to="/login">Zaloguj</RouterLink>
          </button>
        </nav>
      </div>
    </header>
    <main class="main">
      <RouterView :key="refreshKey" />
    </main>
    <footer class="footer">Projekt i wykonanie lnkoc. Wersja RC1.</footer>
  </div>
</template>

<style lang="scss">
.main-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
}
.main {
  flex: 1;
}

.footer {
  align-self: flex-end;
  width: 100%;
  height: 40px;
  bottom: 0px;
  margin-top: 20px;
  padding: 10px;
  color: $primary-color;
  background-color: $secondary-color;
  font-size: $font-size-base;

  @include medium-up {
    width: 1024px;
  }
}

.header {
  width: 100%;
  height: 40px;
  position: relative;
  &__btn {
    margin: 20px 0;
    & a {
      font-weight: $font-weight-bold;
      font-size: $font-size-4;
      color: $primary-color;
    }

    @include medium-up {
      margin: 20px 40px 20px 0;

      & a {
        display: block;
        color: $secondary-color;
        font-size: $font-size-5;
        font-weight: $font-weight-light;
      }
    }
  }

  @include medium-up {
    background-color: $secondary-color;
    height: 80px;
    margin-bottom: 10px;
  }
}

.container-mobile {
  background-color: $secondary-color;
  width: 100%;
  height: 40px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;

  &__btn {
    background-color: $secondary-color;
    width: 40px;
    float: right;
    display: none;
    // z-index: 2;

    & svg {
      float: right;
      height: 40px;
    }
  }
  @include medium-up {
    display: none;
  }
}

.visible {
  display: block;
}

.nav-wrapper {
  position: absolute;
  top: -500px;
  right: 0;
  left: 0;
  transition: top 0.5s ease-in-out;
  flex-direction: column;
  text-align: center;
  z-index: 1;

  &--mobile {
    top: 40px;
    z-index: 1;
  }

  @include medium-up {
    position: static;
    display: block;
    z-index: 0;
  }
}

.navigation {
  background-color: $secondary-color;

  & ul li {
    padding: 20px;

    & a {
      color: $primary-color;
      font-weight: $font-weight-bold;
      font-size: $font-size-4;
    }
    & .active {
      color: $tertiary-color;
    }
  }
  @include medium-up {
    display: flex;
    width: 1024px;
    position: static;
    justify-content: space-between;
    flex-direction: row;

    & ul {
      display: flex;
      margin: 0;

      & li {
        padding: 30px;

        & a {
          color: $primary-color;
          line-height: $line-height-base;
          font-weight: $font-weight-light;
          transition: 0.1s linear;

          &:hover {
            color: $tertiary-color;
          }
        }

        & .active {
          color: $tertiary-color;
        }
      }
    }
  }
}
</style>
