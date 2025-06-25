<script setup>
import { ref } from 'vue'

const refreshKey = ref(0)
const isVisible = ref(true)

function toggleMenu() {
  isVisible.value = !isVisible.value
}

function refresh() {
  refreshKey.value++
}
</script>
<template>
  <header class="header">
    <div class="container">
      <div class="container--mobile">
        <button
          :class="{ visible: isVisible }"
          class="hamburger container--mobile__btn"
          @click="toggleMenu"
        >
          <svg
            width="80px"
            height="80px"
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
          class="hamburger container--mobile__btn"
          @click="toggleMenu"
        >
          <svg
            width="80"
            height="80"
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
      <nav :class="{ 'navigation--mobile': !isVisible }" class="navigation">
        <ul>
          <li>
            <RouterLink to="/blog" @click="refresh">Blog</RouterLink>
          </li>
          <li>
            <RouterLink to="/webgl">WebGL</RouterLink>
          </li>
          <li>
            <RouterLink to="/hobby">Hobby</RouterLink>
          </li>
          <li>
            <RouterLink to="/about">O mnie</RouterLink>
          </li>
          <li>
            <RouterLink to="/contact">Kontakt</RouterLink>
          </li>
        </ul>
        <button class="btn btn--small header__btn">
          <RouterLink to="/login">Zaloguj</RouterLink>
        </button>
      </nav>
    </div>
  </header>
  <RouterView :key="refreshKey" />
</template>

<style lang="scss">
.header {
  margin: 0;

  &__btn {
    margin: 40px 0;
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
  }
}

.container {
  background-color: $secondary-color;
  position: relative;

  &--mobile {
    &__btn {
      width: 100%;
      display: none;
      z-index: 5;
      & svg {
        float: right;
        // height: 60px;
      }
    }
    @include medium-up {
      display: none;
    }
  }
  @include medium-up {
    display: inline-block;
  }
}

.visible {
  display: block;
}

.navigation {
  background-color: $secondary-color;
  position: absolute;
  top: 80px;
  right: -100%;
  transition: right 0.25s ease-in-out;

  &--mobile {
    position: absolute;
    top: 80px;
    right: 0;
    left: 0;
    flex-direction: column;
    text-align: center;
  }
  & ul li {
    padding: 40px;

    & a {
      color: $primary-color;
      font-weight: $font-weight-bold;
      font-size: $font-size-4;
    }
  }
  @include medium-up {
    display: flex;
    width: 1024px;
    position: static;
    justify-content: space-between;

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
      }
    }
  }
}
</style>
