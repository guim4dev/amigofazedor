<template>
  <article class="card">
    <div class="card-inner">
      <div class="card-back">
        <figure class="card-back-inner">
          <NuxtImg src="/images/disco-de-vinil.png" class="disc" />
        </figure>
      </div>
      <div class="card-front">
        <h1>John Doe</h1>
        <p>Architect & Engineer</p>
        <p>We love that guy</p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts"></script>

<style scoped>
.card {
  background-color: transparent;
  width: 200px;
  aspect-ratio: 1;
  perspective: 1000px; /* Remove this if you don't want the 3D effect */
  box-sizing: border-box;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  box-sizing: border-box;
}

.card:hover .card-inner {
  transform: rotateY(180deg);
}

.card-back {
  background-color: var(--color-primary-dark);
}

.card-back-inner {
  display: flex;
  border-radius: 8px;
  background: transparent;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 0;
  border: 1px solid white;
  box-sizing: border-box;
}

.card-back,
.card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
  border-radius: 16px;
  border: 1px solid white;
  padding: 8px;
  box-sizing: border-box;
}

.card-front {
  color: white;
  transform: rotateY(180deg);
}

.disc {
  height: 4rem;
  aspect-ratio: auto;
}
</style>
