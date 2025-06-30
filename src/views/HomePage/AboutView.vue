<template>
  <section class="about">
    <h1 class="heading heading--1">O</h1>
    <p>
      Ta strona jest o autorze niewielkiej, nieskomplikowanej witryny, którą próbuje rozwijać.
      Teksty zamieszczone na niej mogą być traktowane jako zapełniacze miejsca. Jest to wersja
      niefinalna. Czy projekt ten zostanie napisany do wersji 1.0.0 i ujrzy światło dzienne? Czas
      pokaże...
    </p>
    <p>
      Od czasów dzieciństwa, czyli od lat '90-tych mam styczność z szerokorozumianą informatyką.
      Choć początki, jak to zwykle bywa, bywały skromne. Pierwszy komputer, z którym przekroczyłem
      próg wejścia był, a w zasadzie była bardzo popularna na owe czasy Amiga 500 z rozszerzonym,
      całym jednym megabajtem pamięci RAM. Jej procesor osiągał zawrotne jak na moje możliwości
      taktowanie ponad 7 MHz. Za ekran służył domowy telewizor. Pierwszym środowiskiem, jakie
      uruchomiłem, oczywiście z dyskietki, był Workbench i tego dnia spodobał mi się do tego
      stopnia, że pojawiła się chęć poznania innych jego możliwości.
    </p>
    <p>
      Jak czas pokazał, na następny komputer musiałem poczekać dobrych kilka lat. Aczkolwiek, kiedy
      go zobaczyłem, wydawał mi się wyjątkowy. Dzisiaj wiem, że taki był. Klasyczny x86, ale nie ze
      stajni znanych obecnie czerwonych, ani niebieskich. Dzisiaj zapewne niewiele osób pamięta tego
      producenta...
    </p>
    <p>
      Końcem lat dziewięćdziesiątych miałem przyjemność przyjeć się światu linuksa od strony
      użytkownika. Próbując uruchomić radio internetowe uparłem się, iż zrobię to właśnie pod tym
      systemem operacyjnym. I... po kilku dniach prób mogłem powiedzieć, iż zadanie zostało
      wykonane.
    </p>
    <p>
      W dzisiejszych czasach linuks stał się systemem operacyjnym używanym na codzień. Czy to się
      kiedyś zmieni? Zobaczymy!
    </p>
  </section>
</template>

<style lang="scss" scoped>
.about {
  background-color: $secondary-color;
  margin: 10px 0px;
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
