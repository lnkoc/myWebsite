<script></script>

<template>
  <section class="hobby">
    <h1 class="heading heading--1">Moje hobby</h1>
    <p>
      Poza informatyką lubię spojrzeć nieco w inną stronę. Gdy wychodzę na zewnątrz odruchowo
      spoglądam na niebo. Najczęściej nocą moją pierwszą uwagę przyciągają gwiazdozbiory które
      aktualnie są widoczne. W dalszej kolejności sprawdzam fazę w jakiej znajduje się Księżyc.
      Czasem szukam planet naszego Układu Słonecznego. Gdy światła uliczne gasną lub gdy znajduję
      się poza miastem spoglądam na Drogę Mleczną.
    </p>
    <p>
      Innym razem poszukuję zjawisk, których nie można obserwować rok do roku. Niebo się zmienia.
      Raz są to obserwacje Marsa, kiedy był bardzo blisko Ziemii i mogąc na niego spojrzeć przez
      uzbrojone w teleskop oko dostrzegając już tarczę zamiast malutkiego punktu, który można
      podziwiać przy użyciu tego samego sprzętu obecnie. A jeszcze innym może to być zaćmienie
      Słońca, tak jak miało to miejsce w 2006 roku w miejscowości Side w Turcji. Trzy minuty osiem
      sekund, jedne z najdłużych jakie mogłem sobie wyobrazić.
    </p>
    <h2 class="heading heading--2">Trzy wymiary</h2>
    <p>
      Od pierwszych doświadczeń z grafiką trójwymiarową minęło sporo czasu. Zawsze jednak ciekawiło
      mnie to, w jaki sposób komputer radzi sobie z generowaniem i wyświetlaniem obrazów w trzech
      wymiarach. Ponadto chciałem się dowiedzieć, czy będę w stanie stworzyć takie obrazy na
      posiadanym komputerze? Aby się o tym przekonać było mi dane poczekać. Dosyć długo poczekać.
      Pierwszym zagadnieniem, jakie przybliżyło mnie do uzyskania odpowiedzi było poznanie rzutu
      izometrycznego. Dobrych kilka lat później poznając podstawy technologii OpenGL dowiedziałem
      się jak generować pierwsze prymitywy i jak działa kamera. Świat grafiki trójwymiarowej stał
      się bardziej otwarty.
    </p>
  </section>
</template>
<style lang="scss" scoped>
.hobby {
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
