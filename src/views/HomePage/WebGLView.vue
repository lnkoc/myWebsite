<script setup>
import WebGLGAllery from '@/components/WebGLGAllery.vue'
</script>
<template>
  <section class="webgl">
    <h1 class="heading heading--1">WebGL</h1>
    <p>
      Tutaj można znaleźć opisy miniprojektów napisanych przy użyciu WebGL, które swego czasu miałem
      okazję stworzyć poznając tę technologię.
    </p>
    <p>
      Choć obecnie raczej stronię od pisania w czystym OpenGL, to moja uwaga została skupiona na
      technologii umożliwiającej wyświetlanie w przeglądarce intenetowej. Tak też poznałem WebGL, a
      ściślej framework THREE.js. Gdy zacząłem zaznajamiać się z jego możliwościami powstała pewna
      liczba projektów, które można podejrzeć poniżej. Jednym z zagadnień, jakie wydało się
      interesujące jest algorytm do generowania losowych terenów.
    </p>
    <WebGLGAllery />
  </section>
</template>
<style lang="scss" scoped>
.webgl {
  background-color: $secondary-color;
  margin: 20px 0px;
  padding: 10px;
}

.heading {
  margin: 10px;

  @include small-up {
    margin: 20px 20px;
  }

  @include medium-up {
    margin: 40px 40px;
  }
}

p {
  font-size: $font-size-5;
  margin: 0 10px;
  padding: 10px 0;

  @include small-up {
    font-size: $font-size-4;
    margin: 0 20px;
    padding: 20px 0;
  }

  @include medium-up {
    margin: 0 40px;
    padding: 20px 0;
  }
}
</style>
